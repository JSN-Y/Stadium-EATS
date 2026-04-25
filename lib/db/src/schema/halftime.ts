import { pgTable, text, integer, boolean, timestamp } from "drizzle-orm/pg-core";

export const halftimePromosTable = pgTable("halftime_promos", {
  stadiumId: text("stadium_id").primaryKey(),
  active: boolean("active").notNull().default(false),
  menuItemId: text("menu_item_id"),
  discountPercent: integer("discount_percent"),
  message: text("message"),
  expiresAt: timestamp("expires_at", { withTimezone: true }),
});

export type HalftimePromoRow = typeof halftimePromosTable.$inferSelect;
