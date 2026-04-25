import { pgTable, text, integer, timestamp } from "drizzle-orm/pg-core";

export const matchesTable = pgTable("matches", {
  stadiumId: text("stadium_id").primaryKey(),
  homeTeam: text("home_team").notNull(),
  awayTeam: text("away_team").notNull(),
  homeFlag: text("home_flag"),
  awayFlag: text("away_flag"),
  homeScore: integer("home_score").notNull().default(0),
  awayScore: integer("away_score").notNull().default(0),
  minute: integer("minute").notNull().default(0),
  status: text("status").notNull().default("first_half"),
  kickoffAt: timestamp("kickoff_at", { withTimezone: true }).notNull().defaultNow(),
});

export type MatchRow = typeof matchesTable.$inferSelect;
