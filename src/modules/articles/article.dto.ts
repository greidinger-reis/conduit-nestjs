import { ApiProperty } from "@nestjs/swagger"
import { AuthedRequestPayload } from "../auth/interfaces/auth-payload"
import { ArticleEntity } from "./article.entity"

export class _ArticleRO {
    @ApiProperty()
    slug: string

    @ApiProperty()
    title: string

    @ApiProperty()
    description: string

    @ApiProperty()
    body: string

    @ApiProperty()
    tagList: string[]

    @ApiProperty()
    createdAt: Date

    @ApiProperty()
    updatedAt: Date

    @ApiProperty()
    favorited: boolean

    @ApiProperty()
    favoritesCount: number

    @ApiProperty()
    author: {
        name: string
        bio: string | null
        image: string | null
        following: boolean
    }

    constructor(
        articleEntity: ArticleEntity,
        currentUserId?: AuthedRequestPayload["id"],
    ) {
        this.slug = articleEntity.slug
        this.title = articleEntity.title
        this.description = articleEntity.description
        this.body = articleEntity.body
        this.tagList = articleEntity.tagList
        this.createdAt = articleEntity.createdAt
        this.updatedAt = articleEntity.updatedAt
        this.favorited =
            articleEntity.favoritedBy?.some(
                (user) => user.id === currentUserId,
            ) ?? false
        this.favoritesCount = articleEntity.favoritedBy?.length ?? 0
        this.author = {
            name: articleEntity.author.name,
            bio: articleEntity.author.bio,
            image: articleEntity.author.image,
            following:
                articleEntity.author.followers?.some(
                    (follower) => follower.id === currentUserId,
                ) ?? false,
        }
    }
}

export class ArticleRO {
    @ApiProperty()
    article: _ArticleRO

    constructor(
        articleEntity: ArticleEntity,
        currentUserId?: AuthedRequestPayload["id"],
    ) {
        this.article = new _ArticleRO(articleEntity, currentUserId)
    }
}

export class MultipleArticlesRO {
    @ApiProperty()
    articles: _ArticleRO[]

    @ApiProperty()
    articlesCount: number

    constructor(
        articles: _ArticleRO[],
    ) {
        this.articles = articles
        this.articlesCount = articles.length
    }
}
