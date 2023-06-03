import { InferModel } from "drizzle-orm"
import { pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core"
import { ParsedDates, ParsedDatesInsert } from "@/utils/parsed-dates"

export const user = pgTable("user", {
    id: varchar("id", { length: 256 }).notNull().primaryKey(),
    name: varchar("name", { length: 256 }).notNull(),
    password: varchar("password", { length: 256 }).notNull(),
    email: varchar("email", { length: 256 }).notNull(),
    emailVerified: timestamp("emailVerified"),
    bio: text("bio"),
    image: varchar("image", { length: 256 }),
    createdAt: timestamp("created_at", { mode: "string" })
        .notNull()
        .defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "string" })
        .notNull()
        .defaultNow(),
})

export type User = ParsedDates<InferModel<typeof user>>
export type InsertUser = ParsedDatesInsert<InferModel<typeof user, "insert">>
