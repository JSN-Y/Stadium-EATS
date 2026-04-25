import { Router, type IRouter } from "express";
import { and, desc, eq, gte, inArray } from "drizzle-orm";
import { randomUUID } from "node:crypto";
import {
  db,
  adminsTable,
  stadiumsTable,
  ordersTable,
  ridersTable,
  standsTable,
  menuItemsTable,
  notificationsTable,
  halftimePromosTable,
} from "@workspace/db";
import {
  AdminLoginBody,
  AdminLoginResponse,
  GetAdminDashboardResponse,
  GetAdminOrdersResponse,
  GetAdminRidersResponse,
  UpdateStandStatusBody,
  UpdateStandStatusResponse,
  AssignOrderRiderBody,
  AssignOrderRiderResponse,
  BroadcastNotificationBody,
  BroadcastNotificationResponse,
  ListBroadcastsResponse,
  GetOrderHeatmapResponse,
  TriggerHalftimeModeBody,
  TriggerHalftimeModeResponse,
} from "@workspace/api-zod";

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

router.post("/admin/login", async (req, res): Promise<void> => {
  const parsed = AdminLoginBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [row] = await db
    .select()
    .from(adminsTable)
    .where(eq(adminsTable.email, parsed.data.email.toLowerCase()));
  if (!row || row.password !== parsed.data.password) {
    res.status(401).json({ error: "Invalid email or password" });
    return;
  }
  const [stadium] = await db.select().from(stadiumsTable).where(eq(stadiumsTable.id, row.stadiumId));
  res.json(
    AdminLoginResponse.parse({
      id: row.id,
      email: row.email,
      stadiumId: row.stadiumId,
      stadiumName: stadium?.name ?? "",
    }),
  );
});

router.get("/admin/:stadiumId/dashboard", async (req, res): Promise<void> => {
  const stadiumId = String(req.params.stadiumId);
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const stands = await db.select().from(standsTable).where(eq(standsTable.stadiumId, stadiumId));
  const standIds = stands.map((s) => s.id);
  const standById = new Map(stands.map((s) => [s.id, s] as const));

  const todays = standIds.length === 0
    ? []
    : await db
        .select()
        .from(ordersTable)
        .where(and(inArray(ordersTable.standId, standIds), gte(ordersTable.createdAt, startOfDay)));

  const ordersToday = todays.length;
  const revenueTodayMad = todays.reduce((s, o) => s + o.totalMad, 0);
  const delivered = todays.filter((o) => o.status === "delivered" && o.deliveredAt);
  const avgDeliveryMinutes =
    delivered.length === 0
      ? 0
      : Math.round(
          (delivered.reduce(
            (sum, o) => sum + (o.deliveredAt!.getTime() - o.createdAt.getTime()),
            0,
          ) /
            delivered.length /
            60000) *
            10,
        ) / 10;

  const riders = await db.select().from(ridersTable).where(eq(ridersTable.stadiumId, stadiumId));
  const activeRiders = riders.filter((r) => r.status !== "offline").length;

  const byHourMap = new Map<string, number>();
  for (let h = 0; h < 24; h++) byHourMap.set(`${String(h).padStart(2, "0")}:00`, 0);
  for (const o of todays) {
    const key = `${String(o.createdAt.getHours()).padStart(2, "0")}:00`;
    byHourMap.set(key, (byHourMap.get(key) ?? 0) + 1);
  }
  const ordersByHour = Array.from(byHourMap.entries()).map(([hour, count]) => ({ hour, count }));

  const itemMap = new Map<string, { name: string; count: number; standName: string }>();
  for (const o of todays) {
    for (const it of o.items) {
      const key = it.menuItemId;
      const cur = itemMap.get(key) ?? { name: it.name, count: 0, standName: o.standName };
      cur.count += it.quantity;
      itemMap.set(key, cur);
    }
  }
  const topItems = Array.from(itemMap.values()).sort((a, b) => b.count - a.count).slice(0, 6);

  const standMap = new Map<string, { standName: string; count: number; revenueMad: number }>();
  for (const o of todays) {
    const cur = standMap.get(o.standId) ?? { standName: o.standName, count: 0, revenueMad: 0 };
    cur.count += 1;
    cur.revenueMad += o.totalMad;
    standMap.set(o.standId, cur);
  }
  // Ensure every stand appears even if zero orders.
  for (const s of stands) {
    if (!standMap.has(s.id)) standMap.set(s.id, { standName: s.name, count: 0, revenueMad: 0 });
  }
  const ordersByStand = Array.from(standMap.values()).sort((a, b) => b.count - a.count);

  res.json(
    GetAdminDashboardResponse.parse({
      ordersToday,
      revenueTodayMad: Math.round(revenueTodayMad * 100) / 100,
      activeRiders,
      avgDeliveryMinutes,
      ordersByHour,
      topItems,
      ordersByStand,
    }),
  );

  void standById;
});

router.get("/admin/:stadiumId/orders", async (req, res): Promise<void> => {
  const stadiumId = String(req.params.stadiumId);
  const status = typeof req.query.status === "string" ? req.query.status : undefined;
  const stands = await db.select().from(standsTable).where(eq(standsTable.stadiumId, stadiumId));
  const standIds = stands.map((s) => s.id);
  if (standIds.length === 0) {
    res.json([]);
    return;
  }
  const rows = await db
    .select()
    .from(ordersTable)
    .where(
      status
        ? and(inArray(ordersTable.standId, standIds), eq(ordersTable.status, status))
        : inArray(ordersTable.standId, standIds),
    )
    .orderBy(desc(ordersTable.createdAt));
  res.json(GetAdminOrdersResponse.parse(rows.map(serializeOrder)));
});

router.get("/admin/:stadiumId/riders", async (req, res): Promise<void> => {
  const stadiumId = String(req.params.stadiumId);
  const riders = await db.select().from(ridersTable).where(eq(ridersTable.stadiumId, stadiumId));
  const orders = await db
    .select({ id: ordersTable.id, riderId: ordersTable.riderId, status: ordersTable.status })
    .from(ordersTable);
  const counts = new Map<string, number>();
  for (const o of orders) {
    if (!o.riderId) continue;
    if (o.status === "delivered" || o.status === "cancelled") continue;
    counts.set(o.riderId, (counts.get(o.riderId) ?? 0) + 1);
  }
  const out = riders.map((r) => ({
    id: r.id,
    name: r.name,
    stadiumId: r.stadiumId,
    status: r.status,
    activeOrders: counts.get(r.id) ?? 0,
    avatarUrl: r.avatarUrl ?? undefined,
  }));
  res.json(GetAdminRidersResponse.parse(out));
});

router.post("/admin/stands/:standId/status", async (req, res): Promise<void> => {
  const standId = String(req.params.standId);
  const parsed = UpdateStandStatusBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const updates: Partial<typeof standsTable.$inferInsert> = { status: parsed.data.status };
  if (parsed.data.reopenAt) updates.reopenAt = new Date(parsed.data.reopenAt);
  if (parsed.data.maxPendingOrders) updates.maxPendingOrders = parsed.data.maxPendingOrders;
  const [row] = await db.update(standsTable).set(updates).where(eq(standsTable.id, standId)).returning();
  if (!row) {
    res.status(404).json({ error: "Stand not found" });
    return;
  }
  res.json(
    UpdateStandStatusResponse.parse({
      id: row.id,
      stadiumId: row.stadiumId,
      name: row.name,
      description: row.description ?? undefined,
      category: row.category,
      status: row.status,
      avgPrepTimeMinutes: row.avgPrepTimeMinutes,
      pendingOrders: 0,
      maxPendingOrders: row.maxPendingOrders,
      waitTimeMinutes: row.avgPrepTimeMinutes,
      imageUrl: row.imageUrl,
      rating: row.rating,
      location: row.location ?? undefined,
      reopenAt: row.reopenAt ?? undefined,
      isHalalOnly: row.isHalalOnly,
    }),
  );
});

router.post("/admin/orders/:orderId/assign", async (req, res): Promise<void> => {
  const orderId = String(req.params.orderId);
  const parsed = AssignOrderRiderBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [rider] = await db.select().from(ridersTable).where(eq(ridersTable.id, parsed.data.riderId));
  if (!rider) {
    res.status(404).json({ error: "Rider not found" });
    return;
  }
  const [row] = await db
    .update(ordersTable)
    .set({ riderId: rider.id, riderName: rider.name })
    .where(eq(ordersTable.id, orderId))
    .returning();
  if (!row) {
    res.status(404).json({ error: "Order not found" });
    return;
  }
  res.json(AssignOrderRiderResponse.parse(serializeOrder(row)));
});

router.post("/admin/:stadiumId/broadcast", async (req, res): Promise<void> => {
  const stadiumId = String(req.params.stadiumId);
  const parsed = BroadcastNotificationBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [row] = await db
    .insert(notificationsTable)
    .values({
      id: randomUUID(),
      stadiumId,
      message: parsed.data.message,
      section: parsed.data.section,
      type: parsed.data.type ?? "info",
    })
    .returning();
  res.json(BroadcastNotificationResponse.parse(row));
});

router.get("/admin/:stadiumId/broadcasts", async (req, res): Promise<void> => {
  const stadiumId = String(req.params.stadiumId);
  const rows = await db
    .select()
    .from(notificationsTable)
    .where(eq(notificationsTable.stadiumId, stadiumId))
    .orderBy(desc(notificationsTable.sentAt));
  res.json(ListBroadcastsResponse.parse(rows.slice(0, 30)));
});

router.get("/admin/:stadiumId/heatmap", async (req, res): Promise<void> => {
  const stadiumId = String(req.params.stadiumId);
  const [stadium] = await db.select().from(stadiumsTable).where(eq(stadiumsTable.id, stadiumId));
  if (!stadium) {
    res.json([]);
    return;
  }
  const stands = await db.select().from(standsTable).where(eq(standsTable.stadiumId, stadiumId));
  const standIds = stands.map((s) => s.id);
  const orders = standIds.length
    ? await db.select().from(ordersTable).where(inArray(ordersTable.standId, standIds))
    : [];
  const counts = new Map<string, number>();
  for (const s of stadium.sections) counts.set(s, 0);
  for (const o of orders) {
    const sec = o.seat?.section ?? "";
    if (counts.has(sec)) counts.set(sec, (counts.get(sec) ?? 0) + 1);
  }
  const out = Array.from(counts.entries()).map(([section, count]) => ({ section, count }));
  res.json(GetOrderHeatmapResponse.parse(out));
});

router.post("/admin/:stadiumId/halftime", async (req, res): Promise<void> => {
  const stadiumId = String(req.params.stadiumId);
  const parsed = TriggerHalftimeModeBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { active, menuItemId, discountPercent, message } = parsed.data;
  const expiresAt = active ? new Date(Date.now() + 15 * 60 * 1000) : null;

  const existing = await db.select().from(halftimePromosTable).where(eq(halftimePromosTable.stadiumId, stadiumId));
  if (existing.length === 0) {
    await db.insert(halftimePromosTable).values({
      stadiumId,
      active,
      menuItemId: menuItemId ?? null,
      discountPercent: discountPercent ?? null,
      message: message ?? null,
      expiresAt,
    });
  } else {
    await db
      .update(halftimePromosTable)
      .set({
        active,
        menuItemId: menuItemId ?? null,
        discountPercent: discountPercent ?? null,
        message: message ?? null,
        expiresAt,
      })
      .where(eq(halftimePromosTable.stadiumId, stadiumId));
  }

  let menuItemName: string | undefined;
  let standName: string | undefined;
  let imageUrl: string | undefined;
  if (menuItemId) {
    const [m] = await db.select().from(menuItemsTable).where(eq(menuItemsTable.id, menuItemId));
    if (m) {
      menuItemName = m.name;
      imageUrl = m.imageUrl;
      const [s] = await db.select().from(standsTable).where(eq(standsTable.id, m.standId));
      standName = s?.name;
    }
  }

  res.json(
    TriggerHalftimeModeResponse.parse({
      stadiumId,
      active,
      menuItemId: menuItemId ?? undefined,
      menuItemName,
      standName,
      imageUrl,
      discountPercent: discountPercent ?? undefined,
      message: message ?? undefined,
      expiresAt: expiresAt ?? undefined,
    }),
  );
});

export default router;
