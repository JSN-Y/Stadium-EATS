import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const notificationsTable = pgTable("notifications_log", {
  id: text("id").primaryKey(),
  stadiumId: text("stadium_id").notNull(),
  message: text("message").notNull(),
  section: text("section").notNull(),
  type: text("type").notNull().default("info"),
  sentAt: timestamp("sent_at", { withTimezone: true }).notNull().defaultNow(),
});

export type NotificationLog = typeof notificationsTable.$inferSelect;
