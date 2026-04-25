import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { randomUUID } from "node:crypto";
import { db, fanSessionsTable, stadiumsTable } from "@workspace/db";
import { ScanTicketBody, ScanTicketResponse, GetSessionResponse } from "@workspace/api-zod";
import { parseTicketQr } from "../lib/qrcodes";

const router: IRouter = Router();

router.post("/session/scan", async (req, res): Promise<void> => {
  const parsed = ScanTicketBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request" });
    return;
  }

  const ticket = parseTicketQr(parsed.data.qrCode);
  if (!ticket) {
    res.status(400).json({
      error: "Oops! This app is only available inside official FIFA World Cup 2030 venues.",
      code: "INVALID_TICKET",
    });
    return;
  }

  const [stadium] = await db.select().from(stadiumsTable).where(eq(stadiumsTable.id, ticket.stadiumId));
  if (!stadium) {
    res.status(400).json({
      error: "Oops! This app is only available inside official FIFA World Cup 2030 venues.",
      code: "INVALID_STADIUM",
    });
    return;
  }

  const id = randomUUID();
  const [session] = await db
    .insert(fanSessionsTable)
    .values({
      id,
      stadiumId: ticket.stadiumId,
      section: ticket.section,
      row: ticket.row,
      seat: ticket.seat,
      fanName: ticket.fanName,
    })
    .returning();

  res.json(
    ScanTicketResponse.parse({
      id: session!.id,
      stadiumId: session!.stadiumId,
      stadiumName: stadium.name,
      section: session!.section,
      row: session!.row,
      seat: session!.seat,
      fanName: session!.fanName,
      goalPoints: session!.goalPoints,
      ordersCount: session!.ordersCount,
      createdAt: session!.createdAt,
    }),
  );
});

router.get("/session/:sessionId", async (req, res): Promise<void> => {
  const sessionId = String(req.params.sessionId);
  const [session] = await db.select().from(fanSessionsTable).where(eq(fanSessionsTable.id, sessionId));
  if (!session) {
    res.status(404).json({ error: "Session not found" });
    return;
  }
  const [stadium] = await db.select().from(stadiumsTable).where(eq(stadiumsTable.id, session.stadiumId));
  if (!stadium) {
    res.status(404).json({ error: "Stadium not found" });
    return;
  }
  res.json(
    GetSessionResponse.parse({
      id: session.id,
      stadiumId: session.stadiumId,
      stadiumName: stadium.name,
      section: session.section,
      row: session.row,
      seat: session.seat,
      fanName: session.fanName,
      goalPoints: session.goalPoints,
      ordersCount: session.ordersCount,
      createdAt: session.createdAt,
    }),
  );
});

export default router;
