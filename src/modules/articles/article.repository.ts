import { Injectable } from "@nestjs/common"
import { DataSource, Repository } from "typeorm"
import { UserEntity } from "../user/user.entity"
import { ArticleDTO } from "./article.dto"
import { ArticleEntity } from "./article.entity"
import {
    ArticleNotFoundException,
    UserAlreadyFavoritedArticleException,
} from "./exceptions"
import { IArticleRepository } from "./interfaces/repository"
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
        currentUserId?: string,
    ): Promise<ArticleDTO | null> {
        const article = await this.findOneBy({ slug })

        if (!article) {
            return null
        }

        return new ArticleDTO(article, currentUserId)
    }

    async findAll(
        searchParams: IArticleSearchParams,
        currentUserId?: string,
        type?: "global" | "feed",
    ): Promise<ArticleDTO[]> {
        const query = this.createQueryBuilder("article")
            .leftJoinAndSelect("article.author", "author")
            .leftJoinAndSelect("article.favoritedBy", "favoritedBy")
            .leftJoinAndSelect("author.followers", "followers")

        if (type === "feed") {
            query
                .leftJoinAndSelect("followers.following", "following")
                .where("following.id = :currentUserId", { currentUserId })
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
            query.andWhere("favoritedBy.id = :currentUserId", {
                currentUserId,
            })
        }

        query.limit(searchParams.limit ?? 20)

        query.offset(searchParams.offset ?? 0)

        return await query
            .getMany()
            .then((articles) =>
                articles.map(
                    (article) => new ArticleDTO(article, currentUserId),
                ),
            )
    }

    //@ts-expect-error wtf
    async favoriteOneBySlug(
        slug: string,
        currentUser: UserEntity,
    ): Promise<ArticleDTO> {
        const [article] = await this.find({
            where: { slug: slug },
            relations: ["favoritedBy"],
            take: 1,
        })

        if (!article) {
            throw new ArticleNotFoundException()
        }

        if (!article.favoritedBy) {
            article.favoritedBy = [currentUser]
        } else {
            const favorites = new Set(article.favoritedBy.map((u) => u.id))

            if (favorites.has(currentUser.id)) {
                throw new UserAlreadyFavoritedArticleException()
            }

            article.favoritedBy.push(currentUser)
        }

        await this.save(article)

        return new ArticleDTO(article, currentUser.id)
    }
}
