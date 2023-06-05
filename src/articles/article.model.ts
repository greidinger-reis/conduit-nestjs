import { User, user } from "@/users/users.model"
import { InferModel } from "drizzle-orm"
import { index, pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core"

export const article = pgTable(
    "article",
    {
        id: varchar("id", { length: 256 }).notNull().primaryKey(),
        authorId: varchar("author_id", { length: 256 }).references(
            () => user.id,
            { onDelete: "cascade" },
        ),
        slug: varchar("slug", { length: 256 }).notNull(),
        title: varchar("title", { length: 256 }).notNull(),
        description: text("description").notNull(),
        body: text("body").notNull(),
        createdAt: timestamp("created_at", { mode: "date" })
            .notNull()
            .defaultNow(),
        updatedAt: timestamp("updated_at", { mode: "date" })
            .notNull()
            .defaultNow(),
    },
    (post) => ({
        userIdIndex: index("posts__user_id__idx").on(post.authorId),
    }),
)

export type Article = InferModel<typeof article, "select">
export type InsertArticle = InferModel<typeof article, "insert">

export interface ArticleDTO
    extends Pick<
        Article,
        "title" | "description" | "slug" | "body" | "createdAt" | "updatedAt"
    > {
    author: Pick<User, "name" | "bio" | "image"> & { following: boolean }
    favorited: boolean
    favoritesCount: number
    tagList: string[]
}
