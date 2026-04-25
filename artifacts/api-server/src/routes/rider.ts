import { Router, type IRouter } from "express";
import { and, desc, eq, gte } from "drizzle-orm";
import { db, ridersTable, ordersTable } from "@workspace/db";
import {
  RiderLoginBody,
  RiderLoginResponse,
  GetRiderOrdersResponse,
  GetRiderStatsResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

function serializeRider(r: typeof ridersTable.$inferSelect, activeOrders: number) {
  return {
    id: r.id,
    name: r.name,
    stadiumId: r.stadiumId,
    status: r.status,
    activeOrders,
    avatarUrl: r.avatarUrl ?? undefined,
  };
}

router.post("/rider/login", async (req, res): Promise<void> => {
  const parsed = RiderLoginBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [rider] = await db.select().from(ridersTable).where(eq(ridersTable.pin, parsed.data.pin));
  if (!rider) {
    res.status(401).json({ error: "Invalid PIN" });
    return;
  }
  const active = await db
    .select({ id: ordersTable.id })
    .from(ordersTable)
    .where(and(eq(ordersTable.riderId, rider.id), eq(ordersTable.status, "received")));
  res.json(RiderLoginResponse.parse(serializeRider(rider, active.length)));
});

router.get("/rider/:riderId/orders", async (req, res): Promise<void> => {
  const riderId = String(req.params.riderId);
  const rows = await db
    .select()
    .from(ordersTable)
    .where(eq(ordersTable.riderId, riderId))
    .orderBy(desc(ordersTable.createdAt));

  const out = rows.map((o) => ({
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
  }));

  res.json(GetRiderOrdersResponse.parse(out));
});

router.get("/rider/:riderId/stats", async (req, res): Promise<void> => {
  const riderId = String(req.params.riderId);
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const rows = await db
    .select()
    .from(ordersTable)
    .where(and(eq(ordersTable.riderId, riderId), gte(ordersTable.createdAt, startOfDay)));

  let delivered = 0;
  let totalDeliveryMs = 0;
  let active = 0;
  for (const r of rows) {
    if (r.status === "delivered" && r.deliveredAt) {
      delivered++;
      totalDeliveryMs += r.deliveredAt.getTime() - r.createdAt.getTime();
    } else if (r.status !== "cancelled") {
      active++;
    }
  }
  const avgMinutes = delivered > 0 ? totalDeliveryMs / delivered / 60000 : 0;

  res.json(
    GetRiderStatsResponse.parse({
      riderId,
      deliveredToday: delivered,
      activeOrders: active,
      avgDeliveryMinutes: Math.round(avgMinutes * 10) / 10,
    }),
  );
});

export default router;
