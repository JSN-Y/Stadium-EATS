import { pgTable, text } from "drizzle-orm/pg-core";

export const adminsTable = pgTable("admins", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  stadiumId: text("stadium_id").notNull(),
});

export type Admin = typeof adminsTable.$inferSelect;
