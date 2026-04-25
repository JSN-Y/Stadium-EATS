import { pgTable, text, boolean } from "drizzle-orm/pg-core";

export const stadiumsTable = pgTable("stadiums", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  city: text("city").notNull(),
  cityCode: text("city_code").notNull(),
  active: boolean("active").notNull().default(true),
  sections: text("sections").array().notNull(),
});

export type Stadium = typeof stadiumsTable.$inferSelect;
