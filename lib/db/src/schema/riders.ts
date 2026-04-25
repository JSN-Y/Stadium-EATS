import { pgTable, text } from "drizzle-orm/pg-core";

export const ridersTable = pgTable("riders", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  stadiumId: text("stadium_id").notNull(),
  pin: text("pin").notNull(),
  status: text("status").notNull().default("available"),
  avatarUrl: text("avatar_url"),
});

export type Rider = typeof ridersTable.$inferSelect;
