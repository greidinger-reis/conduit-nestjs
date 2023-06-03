import { InferModel } from "drizzle-orm"
import { index, pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core"
import { article } from "./article"
import { user } from "./user"
import { ParsedDates, ParsedDatesInsert } from "@/utils/parsed-dates"

export const comment = pgTable(
    "comment",
    {
        id: text("id").notNull().primaryKey(),
        authorId: varchar("author_id", { length: 256 })
            .notNull()
            .references(() => user.id, {
                onDelete: "cascade",
            }),
        articleId: varchar("article_id", { length: 256 })
            .notNull()
            .references(() => article.id, {
                onDelete: "cascade",
            }),
        body: text("body").notNull(),
        createdAt: timestamp("created_at", { mode: "string" })
            .notNull()
            .defaultNow(),
        updatedAt: timestamp("updated_at", { mode: "string" })
            .notNull()
            .defaultNow(),
    },
    (comment) => ({
        userIdIndex: index("comments__user_id__idx").on(comment.authorId),
        articleIdIndex: index("comments__article_id__idx").on(
            comment.articleId,
        ),
    }),
)

export type Comment = ParsedDates<InferModel<typeof comment, "select">>
export type InsertComment = ParsedDatesInsert<
    InferModel<typeof comment, "insert">
>
