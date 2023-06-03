import { InferModel } from "drizzle-orm"
import { index, pgTable, timestamp, varchar } from "drizzle-orm/pg-core"
import { ParsedDates, ParsedDatesInsert } from "@/utils/parsed-dates"
import { user } from "./user"

export const follow = pgTable(
    "follow",
    {
        id: varchar("id", { length: 256 }).notNull().primaryKey(),
        followerId: varchar("follower_id", { length: 256 })
            .notNull()
            .references(() => user.id, {
                onDelete: "cascade",
            }),
        followeeId: varchar("followee_id", { length: 256 })
            .notNull()
            .references(() => user.id, {
                onDelete: "cascade",
            }),
        createdAt: timestamp("created_at", { mode: "string" })
            .notNull()
            .defaultNow(),
        updatedAt: timestamp("updated_at", { mode: "string" })
            .notNull()
            .defaultNow(),
    },
    (follow) => ({
        followerIndex: index("follows__follower_id__idx").on(follow.followerId),
        followingIndex: index("follows__followee_id__idx").on(
            follow.followeeId
        ),
    })
)

export type Follow = ParsedDates<InferModel<typeof follow>>
export type InsertFollow = ParsedDatesInsert<
    InferModel<typeof follow, "insert">
>
