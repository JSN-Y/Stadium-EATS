import { pgTable, text, real, boolean } from "drizzle-orm/pg-core";

export const menuItemsTable = pgTable("menu_items", {
  id: text("id").primaryKey(),
  standId: text("stand_id").notNull(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  priceMad: real("price_mad").notNull(),
  category: text("category").notNull(),
  allergens: text("allergens").array().notNull().default([]),
  isHalal: boolean("is_halal").notNull().default(true),
  isAvailable: boolean("is_available").notNull().default(true),
  isVegetarian: boolean("is_vegetarian").notNull().default(false),
  isFeatured: boolean("is_featured").notNull().default(false),
  imageUrl: text("image_url").notNull(),
});

export type MenuItem = typeof menuItemsTable.$inferSelect;
