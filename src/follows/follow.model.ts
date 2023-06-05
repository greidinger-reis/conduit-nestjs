import { InferModel } from "drizzle-orm"
import { index, pgTable, timestamp, varchar } from "drizzle-orm/pg-core"
import { user } from "@/users/users.model"

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
        createdAt: timestamp("created_at", { mode: "date" })
            .notNull()
            .defaultNow(),
        updatedAt: timestamp("updated_at", { mode: "date" })
            .notNull()
            .defaultNow(),
    },
    (follow) => ({
        followerIndex: index("follows__follower_id__idx").on(follow.followerId),
        followingIndex: index("follows__followee_id__idx").on(
            follow.followeeId,
        ),
    }),
)

export type Follow = InferModel<typeof follow>
export type InsertFollow = InferModel<typeof follow, "insert">
