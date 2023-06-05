import {
    Article,
    article,
    ArticleDTO,
    InsertArticle,
} from "@/articles/article.model"
import { DrizzleService } from "@/drizzle/drizzle.service"
import { IArticleRepository } from "@/repositories"
import { DefaultDrizzlePgRepository } from "@/repositories/default-drizzle-pg"
import { Injectable } from "@nestjs/common"
import { desc, eq, placeholder, sql } from "drizzle-orm"
import { favorite, follow, tag, user } from "drizzle/schema"
import { IArticleQuery } from "./article.query"

@Injectable()
export class ArticleRepository
    extends DefaultDrizzlePgRepository<typeof article, Article, InsertArticle>
    implements IArticleRepository
{
    constructor(drizzleService: DrizzleService) {
        super(article, drizzleService)
    }

    private singleArticleQuery = this.drizzleService.database
        .select({
            title: article.title,
            slug: article.slug,
            description: article.description,
            body: article.body,
            tagList: sql<string[]>`ARRAY(${this.drizzleService.database
                .select({
                    name: tag.name,
                })
                .from(tag)
                .where(eq(tag.articleId, article.id))})`,
            createdAt: article.createdAt,
            updatedAt: article.updatedAt,
            author: {
                name: user.name,
                bio: user.bio,
                image: user.image,
                following: sql<boolean>`EXISTS(SELECT 1 FROM ${follow} WHERE ${
                    follow.followerId
                } = ${placeholder("currentUserId")} AND ${
                    follow.followeeId
                } = ${article.authorId})`,
            },
            favorited: sql<boolean>`EXISTS(SELECT 1 FROM ${favorite} WHERE ${
                favorite.userId
            } = ${placeholder("currentUserId")} AND ${favorite.articleId} = ${
                article.id
            })`,
            favoritesCount: sql<number>`(SELECT COUNT(*) FROM ${favorite} WHERE ${favorite.articleId} = ${article.id})::integer`,
        })
        .from(article)
        .leftJoin(user, eq(article.authorId, user.id))
        .where(eq(article.slug, placeholder("slug")))
        .limit(1)
        .prepare("single_article")

    private articleListQuery = this.drizzleService.database
        .select({
            title: article.title,
            slug: article.slug,
            description: article.description,
            body: article.body,
            tagList: sql<string[]>`ARRAY(${this.drizzleService.database
                .select({
                    name: tag.name,
                })
                .from(tag)
                .where(eq(tag.articleId, article.id))})`,
            createdAt: article.createdAt,
            updatedAt: article.updatedAt,
            author: {
                name: user.name,
                bio: user.bio,
                image: user.image,
                following: sql<boolean>`EXISTS(SELECT 1 FROM ${follow} WHERE ${
                    follow.followerId
                } = ${placeholder("currentUserId")} AND ${
                    follow.followeeId
                } = ${article.authorId})`,
            },
            favorited: sql<boolean>`EXISTS(SELECT 1 FROM ${favorite} WHERE ${
                favorite.userId
            } = ${placeholder("currentUserId")} AND ${favorite.articleId} = ${
                article.id
            })`,
            favoritesCount: sql<number>`(SELECT COUNT(*) FROM ${favorite} WHERE ${favorite.articleId} = ${article.id})::integer`,
        })
        .from(article)
        .leftJoin(user, eq(article.authorId, user.id))
        .where(
            sql`CASE WHEN ${placeholder("type")} = 'global' THEN
            (${placeholder("tag")} = '' OR ${placeholder(
                "tag",
            )} = ANY(ARRAY(SELECT ${tag.name} FROM ${tag} WHERE ${
                tag.articleId
            } = ${article.id})::text[])) AND
            (${placeholder("author")} = '' OR ${
                article.authorId
            } = ${placeholder("author")}) AND
            (${placeholder(
                "favorited",
            )} = '' OR EXISTS(SELECT 1 FROM ${favorite} WHERE ${
                favorite.userId
            } = ${placeholder("favorited")} AND ${favorite.articleId} = ${
                article.id
            }))
        WHEN ${placeholder("type")} = 'feed' THEN
            ${article.authorId} IN (SELECT ${
                follow.followeeId
            } FROM ${follow} WHERE ${follow.followerId} = ${placeholder(
                "currentUserId",
            )}) AND
            (${placeholder("tag")} = '' OR ${placeholder(
                "tag",
            )} = ANY(ARRAY(SELECT ${tag.name} FROM ${tag} WHERE ${
                tag.articleId
            } = ${article.id})::text[])) AND
            (${placeholder("author")} = '' OR ${
                article.authorId
            } = ${placeholder("author")}) AND
            (${placeholder(
                "favorited",
            )} = '' OR EXISTS(SELECT 1 FROM ${favorite} WHERE ${
                favorite.userId
            } = ${placeholder("favorited")} AND ${favorite.articleId} = ${
                article.id
            }))
        END`,
        )
        .orderBy(desc(article.createdAt))
        .limit(placeholder("limit"))
        .offset(placeholder("offset"))
        .prepare("article_list")

    //@ts-ignore
    public async findAll(
        query: IArticleQuery,
        currentUserId: string = "",
        type: "feed" | "global" = "global",
    ): Promise<ArticleDTO[]> {
        const limit = query.limit ?? 20
        const offset = query.offset ?? 0
        const tag = query.tag ?? ""
        const author = query.author ?? ""
        const favorited = query.favorited ?? ""

        const articles = await this.articleListQuery.execute({
            currentUserId,
            favorited,
            tag,
            author,
            limit,
            offset,
            type,
        })

        return articles as ArticleDTO[]
    }

    public async findBySlug(
        slug: string,
        currentUserId = "",
    ): Promise<ArticleDTO> {
        const [article] = await this.singleArticleQuery.execute({
            slug,
            currentUserId,
        })
        return article as ArticleDTO
    }
}
