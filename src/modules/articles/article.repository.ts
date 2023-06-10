import { Injectable } from "@nestjs/common"
import { DataSource, Repository } from "typeorm"
import { AuthedRequestPayload } from "../auth/interfaces/auth-payload"
import { UserEntity } from "../user/user.entity"
import { ArticleRO } from "./article.dto"
import { ArticleEntity } from "./article.entity"
import {
    ArticleNotFoundException,
    UserAlreadyFavoritedArticleException,
    UserHasntFavoritedArticleException,
} from "./exceptions"
import { ArticleFeedType, IArticleRepository } from "./interfaces/repository"
import { IArticleSearchParams } from "./interfaces/search-params"

@Injectable()
export class ArticleRepository
    extends Repository<ArticleEntity>
    implements IArticleRepository
{
    constructor(private readonly dataSource: DataSource) {
        super(ArticleEntity, dataSource.createEntityManager())
    }

    async findOneBySlug(
        slug: string,
        user?: AuthedRequestPayload,
    ): Promise<ArticleRO | null> {
        const article = await this.findOneBy({ slug })

        if (!article) {
            return null
        }

        return new ArticleRO(article, user?.id)
    }

    async findAll(
        searchParams: IArticleSearchParams,
        user?: AuthedRequestPayload,
        feedType: ArticleFeedType = ArticleFeedType.GLOBAL,
    ): Promise<ArticleRO[]> {
        const query = this.createQueryBuilder("article")
            .leftJoinAndSelect("article.author", "author")
            .leftJoinAndSelect("article.favoritedBy", "favoritedBy")
            .leftJoinAndSelect("author.followers", "followers")

        if (feedType === ArticleFeedType.FEED) {
            query
                .leftJoinAndSelect("followers.following", "following")
                .where("following.id = :currentUserId", { currentUserId: user })
        }

        if (searchParams.tag) {
            query.andWhere(":tag = ANY(article.tagList)", {
                tag: searchParams.tag,
            })
        }

        if (searchParams.author) {
            query.andWhere("author.name = :author", {
                author: searchParams.author,
            })
        }

        if (searchParams.favorited) {
            query.andWhere("favoritedBy.name = :favoritedBy", {
                favoritedBy: searchParams.favorited,
            })
        }

        query.limit(searchParams.limit ?? 20)

        query.offset(searchParams.offset ?? 0)

        return await query
            .getMany()
            .then((articles) =>
                articles.map((article) => new ArticleRO(article, user?.id)),
            )
    }

    async favoriteOneBySlug(
        slug: string,
        user: UserEntity,
    ): Promise<ArticleRO> {
        const [article] = await this.find({
            where: { slug: slug },
            relations: ["favoritedBy"],
            take: 1,
        })

        if (!article) {
            throw new ArticleNotFoundException()
        }

        if (!article.favoritedBy) {
            article.favoritedBy = [user]
        } else {
            const favorites = new Set(article.favoritedBy.map((u) => u.id))

            if (favorites.has(user.id)) {
                throw new UserAlreadyFavoritedArticleException()
            }

            article.favoritedBy.push(user)
        }

        await this.save(article)

        return new ArticleRO(article, user.id)
    }

    async unfavoriteOneBySlug(
        slug: string,
        user: UserEntity,
    ): Promise<ArticleRO> {
        const [article] = await this.find({
            where: { slug: slug },
            relations: ["favoritedBy"],
            take: 1,
        })

        if (!article) {
            throw new ArticleNotFoundException()
        }

        if (!article.favoritedBy) {
            article.favoritedBy = [user]
        } else {
            const favorites = new Set(article.favoritedBy.map((u) => u.id))

            if (!favorites.has(user.id)) {
                throw new UserHasntFavoritedArticleException()
            }

            article.favoritedBy = article.favoritedBy.filter(
                (u) => u.id !== user.id,
            )
        }

        await this.save(article)

        return new ArticleRO(article, user.id)
    }

    public async findAllTags(): Promise<string[]> {
        const articles = await this.find({ select: ["tagList"] })

        const tags = articles.flatMap((article) => article.tagList)

        const uniqueTags = new Set(tags)

        return Array.from(uniqueTags)
    }
}
