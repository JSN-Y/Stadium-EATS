import { pgTable, text, integer, boolean, timestamp, real } from "drizzle-orm/pg-core";

export const standsTable = pgTable("stands", {
  id: text("id").primaryKey(),
  stadiumId: text("stadium_id").notNull(),
  name: text("name").notNull(),
  description: text("description"),
  category: text("category").notNull(),
  status: text("status").notNull().default("open"),
  avgPrepTimeMinutes: integer("avg_prep_time_minutes").notNull().default(8),
  maxPendingOrders: integer("max_pending_orders").notNull().default(50),
  imageUrl: text("image_url").notNull(),
  rating: real("rating").notNull().default(4.6),
  location: text("location"),
  reopenAt: timestamp("reopen_at", { withTimezone: true }),
  isHalalOnly: boolean("is_halal_only").notNull().default(false),
});

export type Stand = typeof standsTable.$inferSelect;
