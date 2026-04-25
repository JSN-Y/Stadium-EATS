import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, stadiumsTable, standsTable, menuItemsTable } from "@workspace/db";
import {
  ListStadiumsResponse,
  GetStadiumResponse,
  ListStandsResponse,
  GetStandResponse,
  GetStandMenuResponse,
} from "@workspace/api-zod";
import { getPendingCountsForStands, getStandPendingOrderCount, projectStand } from "../lib/wait";

const router: IRouter = Router();

router.get("/stadiums", async (_req, res): Promise<void> => {
  const rows = await db.select().from(stadiumsTable);
  res.json(ListStadiumsResponse.parse(rows));
});

router.get("/stadiums/:stadiumId", async (req, res): Promise<void> => {
  const stadiumId = String(req.params.stadiumId);
  const [row] = await db.select().from(stadiumsTable).where(eq(stadiumsTable.id, stadiumId));
  if (!row) {
    res.status(404).json({ error: "Stadium not found" });
    return;
  }
  res.json(GetStadiumResponse.parse(row));
});

router.get("/stadiums/:stadiumId/stands", async (req, res): Promise<void> => {
  const stadiumId = String(req.params.stadiumId);
  const category = typeof req.query.category === "string" ? req.query.category : undefined;
  const rows = await db.select().from(standsTable).where(eq(standsTable.stadiumId, stadiumId));
  const filtered = category ? rows.filter((r) => r.category === category) : rows;
  const counts = await getPendingCountsForStands(filtered.map((r) => r.id));
  const out = filtered.map((s) => projectStand(s, counts.get(s.id) ?? 0));
  res.json(ListStandsResponse.parse(out));
});

router.get("/stands/:standId", async (req, res): Promise<void> => {
  const standId = String(req.params.standId);
  const [row] = await db.select().from(standsTable).where(eq(standsTable.id, standId));
  if (!row) {
    res.status(404).json({ error: "Stand not found" });
    return;
  }
  const pending = await getStandPendingOrderCount(row.id);
  res.json(GetStandResponse.parse(projectStand(row, pending)));
});

router.get("/stands/:standId/menu", async (req, res): Promise<void> => {
  const standId = String(req.params.standId);
  const rows = await db.select().from(menuItemsTable).where(eq(menuItemsTable.standId, standId));
  res.json(GetStandMenuResponse.parse(rows));
});

export default router;
