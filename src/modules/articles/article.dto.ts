import { ApiProperty } from "@nestjs/swagger"
import { ArticleEntity } from "./article.entity"

export class ArticleDTO {
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
        bio: string
        image: string
        following: boolean
    }

    constructor(articleEntity: ArticleEntity, currentUserId?: string) {
        this.slug = articleEntity.slug
        this.title = articleEntity.title
        this.description = articleEntity.description
        this.body = articleEntity.body
        this.tagList = articleEntity.tagList
        this.createdAt = articleEntity.createdAt
        this.updatedAt = articleEntity.updatedAt
        this.favorited = articleEntity.author.favorites.some(
            (favorite) => favorite.id === articleEntity.id,
        )
        this.favoritesCount = articleEntity.favoritedBy.length
        this.author = {
            name: articleEntity.author.name,
            bio: articleEntity.author.bio,
            image: articleEntity.author.image,
            following: articleEntity.author.followers.some(
                (follower) => follower.id === currentUserId,
            ),
        }
    }
}
