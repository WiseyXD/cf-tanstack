import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

// Trips table - stores basic trip information
export const trips = sqliteTable("trips", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  shareCode: text("share_code").notNull().unique(), // 6-8 char code for sharing
  name: text("name").notNull(),
  description: text("description"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

// Trip members - people who joined the trip
export const tripMembers = sqliteTable("trip_members", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  tripId: integer("trip_id")
    .notNull()
    .references(() => trips.id, { onDelete: "cascade" }),
  name: text("name").notNull(), // User's display name
  joinedAt: integer("joined_at", { mode: "timestamp" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

// Expenses - individual spending records
export const expenses = sqliteTable("expenses", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  tripId: integer("trip_id")
    .notNull()
    .references(() => trips.id, { onDelete: "cascade" }),
  paidById: integer("paid_by_id")
    .notNull()
    .references(() => tripMembers.id, { onDelete: "cascade" }),
  amount: real("amount").notNull(), // Amount spent
  description: text("description").notNull(), // What was bought
  category: text("category"), // Optional: food, transport, accommodation, etc.
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

// Expense splits - who should pay for each expense
export const expenseSplits = sqliteTable("expense_splits", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  expenseId: integer("expense_id")
    .notNull()
    .references(() => expenses.id, { onDelete: "cascade" }),
  memberId: integer("member_id")
    .notNull()
    .references(() => tripMembers.id, { onDelete: "cascade" }),
  splitAmount: real("split_amount").notNull(), // How much this member owes for this expense
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

// Indexes for better performance
export const indexes = {
  tripShareCodeIdx: sql`CREATE INDEX IF NOT EXISTS idx_trips_share_code ON trips(share_code)`,
  tripMembersTripIdx: sql`CREATE INDEX IF NOT EXISTS idx_trip_members_trip_id ON trip_members(trip_id)`,
  expensesTripIdx: sql`CREATE INDEX IF NOT EXISTS idx_expenses_trip_id ON expenses(trip_id)`,
  expensesPaidByIdx: sql`CREATE INDEX IF NOT EXISTS idx_expenses_paid_by_id ON expenses(paid_by_id)`,
  expenseSplitsExpenseIdx: sql`CREATE INDEX IF NOT EXISTS idx_expense_splits_expense_id ON expense_splits(expense_id)`,
  expenseSplitsMemberIdx: sql`CREATE INDEX IF NOT EXISTS idx_expense_splits_member_id ON expense_splits(member_id)`,
};

// Types for better TypeScript support
export type Trip = typeof trips.$inferSelect;
export type NewTrip = typeof trips.$inferInsert;
export type TripMember = typeof tripMembers.$inferSelect;
export type NewTripMember = typeof tripMembers.$inferInsert;
export type Expense = typeof expenses.$inferSelect;
export type NewExpense = typeof expenses.$inferInsert;
export type ExpenseSplit = typeof expenseSplits.$inferSelect;
export type NewExpenseSplit = typeof expenseSplits.$inferInsert;
