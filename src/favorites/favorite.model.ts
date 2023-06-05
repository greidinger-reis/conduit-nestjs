import { article } from "@/articles/article.model"
import { user } from "@/users/users.model"
import { InferModel } from "drizzle-orm"
import { index, pgTable, timestamp, varchar } from "drizzle-orm/pg-core"

export const favorite = pgTable(
    "favorite",
    {
        id: varchar("id", { length: 256 }).notNull().primaryKey(),
        userId: varchar("user_id", { length: 256 })
            .notNull()
            .references(() => user.id, {
                onDelete: "cascade",
            }),
        articleId: varchar("article_id", { length: 256 })
            .notNull()
            .references(() => article.id, {
                onDelete: "cascade",
            }),
        createdAt: timestamp("created_at", { mode: "date" })
            .notNull()
            .defaultNow(),
        updatedAt: timestamp("updated_at", { mode: "date" })
            .notNull()
            .defaultNow(),
    },
    (favorite) => ({
        userIdIndex: index("favorites__user_id__idx").on(favorite.userId),
        articleIdIndex: index("favorites__article_id__idx").on(
            favorite.articleId,
        ),
    }),
)

export type Favorite = InferModel<typeof favorite, "select">
export type InsertFavorite = InferModel<typeof favorite, "insert">
