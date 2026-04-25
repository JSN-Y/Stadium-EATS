import { pgTable, text, integer, timestamp } from "drizzle-orm/pg-core";

export const fanSessionsTable = pgTable("fan_sessions", {
  id: text("id").primaryKey(),
  stadiumId: text("stadium_id").notNull(),
  section: text("section").notNull(),
  row: text("row").notNull(),
  seat: text("seat").notNull(),
  fanName: text("fan_name").notNull(),
  goalPoints: integer("goal_points").notNull().default(0),
  ordersCount: integer("orders_count").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type FanSession = typeof fanSessionsTable.$inferSelect;
