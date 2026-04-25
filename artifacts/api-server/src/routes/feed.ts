import { Router, type IRouter } from "express";
import { desc, eq, gte, inArray } from "drizzle-orm";
import { db, ordersTable, standsTable, menuItemsTable, halftimePromosTable, matchesTable } from "@workspace/db";
import {
  GetTrendingItemsResponse,
  GetStadiumFeedResponse,
  GetLiveMatchResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/stadiums/:stadiumId/trending", async (req, res): Promise<void> => {
  const stadiumId = String(req.params.stadiumId);
  const section = typeof req.query.section === "string" ? req.query.section : undefined;
  const stands = await db.select().from(standsTable).where(eq(standsTable.stadiumId, stadiumId));
  const standMap = new Map(stands.map((s) => [s.id, s] as const));
  const standIds = stands.map((s) => s.id);
  if (standIds.length === 0) {
    res.json([]);
    return;
  }
  const since = new Date(Date.now() - 60 * 60 * 1000);
  const orders = await db
    .select()
    .from(ordersTable)
    .where(inArray(ordersTable.standId, standIds));

  const counts = new Map<string, { name: string; standId: string; standName: string; count: number; section?: string }>();
  for (const o of orders) {
    if (section && o.seat?.section !== section) continue;
    const recent = o.createdAt >= since;
    for (const it of o.items) {
      const cur = counts.get(it.menuItemId) ?? {
        name: it.name,
        standId: o.standId,
        standName: o.standName,
        count: 0,
        section: o.seat?.section,
      };
      cur.count += recent ? it.quantity * 2 : it.quantity;
      counts.set(it.menuItemId, cur);
    }
  }

  // Always show something — fall back to featured menu items if quiet.
  if (counts.size < 4) {
    const featured = await db.select().from(menuItemsTable).where(inArray(menuItemsTable.standId, standIds));
    for (const m of featured.filter((m) => m.isFeatured).slice(0, 6)) {
      if (counts.has(m.id)) continue;
      const stand = standMap.get(m.standId);
      counts.set(m.id, {
        name: m.name,
        standId: m.standId,
        standName: stand?.name ?? "Stand",
        count: 1,
        section,
      });
    }
  }

  const top = Array.from(counts.entries())
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 8);
  const ids = top.map(([id]) => id);
  const items = ids.length
    ? await db.select().from(menuItemsTable).where(inArray(menuItemsTable.id, ids))
    : [];
  const itemById = new Map(items.map((i) => [i.id, i] as const));

  const out = top
    .map(([id, v]) => {
      const m = itemById.get(id);
      if (!m) return null;
      return {
        menuItemId: id,
        name: v.name,
        standId: v.standId,
        standName: v.standName,
        ordersLastHour: v.count,
        imageUrl: m.imageUrl,
        priceMad: m.priceMad,
        section: v.section,
      };
    })
    .filter((v): v is NonNullable<typeof v> => v !== null);

  res.json(GetTrendingItemsResponse.parse(out));
});

router.get("/stadiums/:stadiumId/feed", async (req, res): Promise<void> => {
  const stadiumId = String(req.params.stadiumId);
  const stands = await db.select().from(standsTable).where(eq(standsTable.stadiumId, stadiumId));
  const standIds = stands.map((s) => s.id);
  if (standIds.length === 0) {
    res.json([]);
    return;
  }
  const since = new Date(Date.now() - 60 * 60 * 1000);
  const orders = await db
    .select()
    .from(ordersTable)
    .where(inArray(ordersTable.standId, standIds))
    .orderBy(desc(ordersTable.createdAt));
  const recent = orders.filter((o) => o.createdAt >= since).slice(0, 12);

  const events = recent.map((o) => {
    const first = o.items[0];
    return {
      id: o.id,
      message: `Section ${o.seat?.section ?? "?"} just ordered ${first?.name ?? "food"}`,
      section: o.seat?.section ?? "?",
      standName: o.standName,
      itemName: first?.name ?? "an item",
      imageUrl: first?.imageUrl,
      createdAt: o.createdAt,
    };
  });

  res.json(GetStadiumFeedResponse.parse(events));
  void gte;
});

router.get("/stadiums/:stadiumId/match", async (req, res): Promise<void> => {
  const stadiumId = String(req.params.stadiumId);
  const [m] = await db.select().from(matchesTable).where(eq(matchesTable.stadiumId, stadiumId));
  if (!m) {
    res.status(404).json({ error: "No live match" });
    return;
  }
  res.json(
    GetLiveMatchResponse.parse({
      stadiumId: m.stadiumId,
      homeTeam: m.homeTeam,
      awayTeam: m.awayTeam,
      homeFlag: m.homeFlag ?? undefined,
      awayFlag: m.awayFlag ?? undefined,
      homeScore: m.homeScore,
      awayScore: m.awayScore,
      minute: m.minute,
      status: m.status,
      kickoffAt: m.kickoffAt,
    }),
  );
  void halftimePromosTable;
});

export default router;
