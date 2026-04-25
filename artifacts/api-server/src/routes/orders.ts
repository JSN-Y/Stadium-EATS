import { Router, type IRouter } from "express";
import { and, desc, eq, inArray } from "drizzle-orm";
import { randomUUID } from "node:crypto";
import {
  db,
  ordersTable,
  standsTable,
  menuItemsTable,
  fanSessionsTable,
  ridersTable,
  type StoredOrderItem,
} from "@workspace/db";
import {
  CreateOrderBody,
  CreateOrderResponse,
  GetOrderResponse,
  ListSessionOrdersResponse,
  RateOrderBody,
  RateOrderResponse,
  UpdateOrderStatusBody,
  UpdateOrderStatusResponse,
} from "@workspace/api-zod";
import { computeWaitMinutes, getStandPendingOrderCount } from "../lib/wait";

const router: IRouter = Router();

function serializeOrder(o: typeof ordersTable.$inferSelect) {
  return {
    id: o.id,
    sessionId: o.sessionId,
    standId: o.standId,
    standName: o.standName,
    riderId: o.riderId ?? undefined,
    riderName: o.riderName ?? undefined,
    items: o.items,
    status: o.status,
    seat: o.seat,
    subtotalMad: o.subtotalMad,
    deliveryFeeMad: o.deliveryFeeMad,
    totalMad: o.totalMad,
    etaMinutes: o.etaMinutes,
    createdAt: o.createdAt,
    scheduledFor: o.scheduledFor ?? undefined,
    deliveredAt: o.deliveredAt ?? undefined,
    rating: o.rating ?? undefined,
    isPreOrder: o.isPreOrder,
    fanName: o.fanName,
  };
}

async function autoAssignRider(stadiumId: string): Promise<{ id: string; name: string } | null> {
  const riders = await db.select().from(ridersTable).where(eq(ridersTable.stadiumId, stadiumId));
  if (riders.length === 0) return null;
  // Choose rider with fewest active orders.
  const active = await db
    .select({ id: ordersTable.id, riderId: ordersTable.riderId })
    .from(ordersTable)
    .where(and(eq(ordersTable.standId, ordersTable.standId), inArray(ordersTable.status, ["received", "preparing", "on_the_way"])));
  const counts = new Map<string, number>();
  for (const a of active) {
    if (!a.riderId) continue;
    counts.set(a.riderId, (counts.get(a.riderId) ?? 0) + 1);
  }
  riders.sort((a, b) => (counts.get(a.id) ?? 0) - (counts.get(b.id) ?? 0));
  const chosen = riders[0]!;
  return { id: chosen.id, name: chosen.name };
}

router.post("/orders", async (req, res): Promise<void> => {
  const parsed = CreateOrderBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { sessionId, standId, items, scheduledFor } = parsed.data;

  const [session] = await db.select().from(fanSessionsTable).where(eq(fanSessionsTable.id, sessionId));
  if (!session) {
    res.status(400).json({ error: "Invalid session", code: "NO_SESSION" });
    return;
  }

  const [stand] = await db.select().from(standsTable).where(eq(standsTable.id, standId));
  if (!stand) {
    res.status(400).json({ error: "Stand not found" });
    return;
  }
  if (stand.status === "closed") {
    res.status(400).json({ error: "This stand is closed for the day.", code: "STAND_CLOSED" });
    return;
  }
  if (stand.status === "temp_closed") {
    res.status(400).json({
      error: "This stand is at full capacity right now. Try again in a few minutes!",
      code: "STAND_TEMP_CLOSED",
    });
    return;
  }
  const pending = await getStandPendingOrderCount(standId);
  if (pending >= stand.maxPendingOrders) {
    res.status(400).json({
      error: "This stand is at full capacity right now. Try again in a few minutes!",
      code: "STAND_FULL",
    });
    return;
  }

  const menuRows = await db
    .select()
    .from(menuItemsTable)
    .where(
      and(
        eq(menuItemsTable.standId, standId),
        inArray(
          menuItemsTable.id,
          items.map((i) => i.menuItemId),
        ),
      ),
    );
  const byId = new Map(menuRows.map((m) => [m.id, m] as const));

  const stored: StoredOrderItem[] = [];
  let subtotal = 0;
  for (const it of items) {
    const m = byId.get(it.menuItemId);
    if (!m) {
      res.status(400).json({ error: `Menu item ${it.menuItemId} not in this stand.` });
      return;
    }
    const qty = Math.max(1, it.quantity);
    subtotal += m.priceMad * qty;
    stored.push({
      menuItemId: m.id,
      name: m.name,
      quantity: qty,
      priceMad: m.priceMad,
      imageUrl: m.imageUrl,
    });
  }

  const deliveryFee = subtotal >= 100 ? 0 : 8;
  const total = Math.round((subtotal + deliveryFee) * 100) / 100;
  const eta = computeWaitMinutes(pending + 1, stand.avgPrepTimeMinutes) + 4;

  const rider = await autoAssignRider(stand.stadiumId);

  const [order] = await db
    .insert(ordersTable)
    .values({
      id: randomUUID(),
      sessionId,
      standId,
      standName: stand.name,
      riderId: rider?.id,
      riderName: rider?.name,
      fanName: session.fanName,
      items: stored,
      status: "received",
      seat: {
        stadiumId: session.stadiumId,
        section: session.section,
        row: session.row,
        seat: session.seat,
      },
      subtotalMad: subtotal,
      deliveryFeeMad: deliveryFee,
      totalMad: total,
      etaMinutes: eta,
      scheduledFor: scheduledFor ? new Date(scheduledFor) : null,
      isPreOrder: !!scheduledFor,
    })
    .returning();

  await db
    .update(fanSessionsTable)
    .set({
      goalPoints: session.goalPoints + Math.max(10, Math.floor(total / 5)),
      ordersCount: session.ordersCount + 1,
    })
    .where(eq(fanSessionsTable.id, session.id));

  res.json(CreateOrderResponse.parse(serializeOrder(order!)));
});

router.get("/orders/session/:sessionId", async (req, res): Promise<void> => {
  const sessionId = String(req.params.sessionId);
  const rows = await db
    .select()
    .from(ordersTable)
    .where(eq(ordersTable.sessionId, sessionId))
    .orderBy(desc(ordersTable.createdAt));
  res.json(ListSessionOrdersResponse.parse(rows.map(serializeOrder)));
});

router.get("/orders/:orderId", async (req, res): Promise<void> => {
  const orderId = String(req.params.orderId);
  const [row] = await db.select().from(ordersTable).where(eq(ordersTable.id, orderId));
  if (!row) {
    res.status(404).json({ error: "Order not found" });
    return;
  }
  res.json(GetOrderResponse.parse(serializeOrder(row)));
});

router.post("/orders/:orderId/status", async (req, res): Promise<void> => {
  const orderId = String(req.params.orderId);
  const parsed = UpdateOrderStatusBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { status, riderId } = parsed.data;

  const updates: Partial<typeof ordersTable.$inferInsert> = { status };
  if (status === "delivered") updates.deliveredAt = new Date();

  if (riderId) {
    const [rider] = await db.select().from(ridersTable).where(eq(ridersTable.id, riderId));
    if (rider) {
      updates.riderId = rider.id;
      updates.riderName = rider.name;
    }
  }

  const [row] = await db.update(ordersTable).set(updates).where(eq(ordersTable.id, orderId)).returning();
  if (!row) {
    res.status(404).json({ error: "Order not found" });
    return;
  }
  res.json(UpdateOrderStatusResponse.parse(serializeOrder(row)));
});

router.post("/orders/:orderId/rate", async (req, res): Promise<void> => {
  const orderId = String(req.params.orderId);
  const parsed = RateOrderBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [row] = await db
    .update(ordersTable)
    .set({ rating: parsed.data.rating })
    .where(eq(ordersTable.id, orderId))
    .returning();
  if (!row) {
    res.status(404).json({ error: "Order not found" });
    return;
  }
  res.json(RateOrderResponse.parse(serializeOrder(row)));
});

export default router;
