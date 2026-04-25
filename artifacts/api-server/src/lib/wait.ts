import { db, ordersTable, standsTable } from "@workspace/db";
import { and, eq, inArray } from "drizzle-orm";

const ACTIVE_STATUSES = ["received", "preparing", "on_the_way"];

export async function getStandPendingOrderCount(standId: string): Promise<number> {
  const rows = await db
    .select({ id: ordersTable.id })
    .from(ordersTable)
    .where(and(eq(ordersTable.standId, standId), inArray(ordersTable.status, ACTIVE_STATUSES)));
  return rows.length;
}

export async function getPendingCountsForStands(standIds: string[]): Promise<Map<string, number>> {
  const map = new Map<string, number>();
  if (standIds.length === 0) return map;
  const rows = await db
    .select({ id: ordersTable.id, standId: ordersTable.standId })
    .from(ordersTable)
    .where(and(inArray(ordersTable.standId, standIds), inArray(ordersTable.status, ACTIVE_STATUSES)));
  for (const r of rows) {
    map.set(r.standId, (map.get(r.standId) ?? 0) + 1);
  }
  return map;
}

export function computeWaitMinutes(pendingOrders: number, avgPrepMinutes: number): number {
  // Simple linear model with a small floor.
  const base = Math.max(2, Math.ceil(avgPrepMinutes * 0.6));
  return base + Math.ceil(pendingOrders * (avgPrepMinutes / 4));
}

export function effectiveStandStatus(
  baseStatus: string,
  pendingOrders: number,
  maxPendingOrders: number,
): string {
  if (baseStatus === "closed" || baseStatus === "temp_closed") return baseStatus;
  if (pendingOrders >= maxPendingOrders) return "temp_closed";
  if (pendingOrders >= Math.max(8, Math.floor(maxPendingOrders * 0.5))) return "busy";
  return "open";
}

export type StandView = Awaited<ReturnType<typeof db.select>>;

export function projectStand(
  stand: typeof standsTable.$inferSelect,
  pendingOrders: number,
) {
  const status = effectiveStandStatus(stand.status, pendingOrders, stand.maxPendingOrders);
  return {
    id: stand.id,
    stadiumId: stand.stadiumId,
    name: stand.name,
    description: stand.description ?? undefined,
    category: stand.category,
    status,
    avgPrepTimeMinutes: stand.avgPrepTimeMinutes,
    pendingOrders,
    maxPendingOrders: stand.maxPendingOrders,
    waitTimeMinutes: computeWaitMinutes(pendingOrders, stand.avgPrepTimeMinutes),
    imageUrl: stand.imageUrl,
    rating: stand.rating,
    location: stand.location ?? undefined,
    reopenAt: stand.reopenAt ?? undefined,
    isHalalOnly: stand.isHalalOnly,
  };
}
