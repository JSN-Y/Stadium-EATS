import { pgTable, text, integer, real, timestamp, jsonb, boolean } from "drizzle-orm/pg-core";

export type StoredOrderItem = {
  menuItemId: string;
  name: string;
  quantity: number;
  priceMad: number;
  imageUrl?: string;
};

export type StoredSeatInfo = {
  stadiumId: string;
  section: string;
  row: string;
  seat: string;
};

export const ordersTable = pgTable("orders", {
  id: text("id").primaryKey(),
  sessionId: text("session_id").notNull(),
  standId: text("stand_id").notNull(),
  standName: text("stand_name").notNull(),
  riderId: text("rider_id"),
  riderName: text("rider_name"),
  fanName: text("fan_name").notNull(),
  items: jsonb("items").$type<StoredOrderItem[]>().notNull(),
  status: text("status").notNull().default("received"),
  seat: jsonb("seat").$type<StoredSeatInfo>().notNull(),
  subtotalMad: real("subtotal_mad").notNull(),
  deliveryFeeMad: real("delivery_fee_mad").notNull().default(0),
  totalMad: real("total_mad").notNull(),
  etaMinutes: integer("eta_minutes").notNull().default(15),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  scheduledFor: timestamp("scheduled_for", { withTimezone: true }),
  deliveredAt: timestamp("delivered_at", { withTimezone: true }),
  rating: integer("rating"),
  isPreOrder: boolean("is_pre_order").notNull().default(false),
});

export type Order = typeof ordersTable.$inferSelect;
