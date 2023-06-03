import { InferModel } from "drizzle-orm"
import { index, pgTable, timestamp, varchar } from "drizzle-orm/pg-core"
import { article } from "@/articles/article.model"
import { ParsedDates, ParsedDatesInsert } from "@/utils/parse-dates"

export const tag = pgTable(
    "tag",
    {
        id: varchar("id", { length: 256 }).notNull().primaryKey(),
        name: varchar("name", { length: 256 }).notNull(),
        articleId: varchar("article_id", { length: 256 })
            .notNull()
            .references(() => article.id, {
                onDelete: "cascade",
            }),
        createdAt: timestamp("created_at", { mode: "string" })
            .notNull()
            .defaultNow(),
        updatedAt: timestamp("updated_at", { mode: "string" })
            .notNull()
            .defaultNow(),
    },
    (tag) => ({
        articleIdIndex: index("tags__article_id__idx").on(tag.articleId),
    })
)

export type Tag = ParsedDates<InferModel<typeof tag>>
export type InsertTag = ParsedDatesInsert<InferModel<typeof tag, "insert">>
