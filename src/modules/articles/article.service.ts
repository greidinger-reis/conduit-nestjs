import { Injectable, UnauthorizedException } from "@nestjs/common"
import { randomFillSync } from "node:crypto"
import slugify from "slugify"
import { AuthedRequestPayload } from "../auth/interfaces/auth-payload"
import { CommentRO } from "../comment/comment.dto"
import { UserRepository } from "../user/user.repository"
import { ArticleDTO } from "./article.dto"
import { ArticleEntity } from "./article.entity"
import { ArticleRepository } from "./article.repository"
import {
    ArticleNotFoundException,
    NotArticleAuthorException,
} from "./exceptions"
import { ICreateArticleInput } from "./inputs/create"
import { IUpdateArticleInput } from "./inputs/update"
import { ArticleFeedType } from "./interfaces/repository"
import { IArticleSearchParams } from "./interfaces/search-params"

@Injectable()
export class ArticleService {
    constructor(
        private readonly articleRepository: ArticleRepository,
        private readonly userRepository: UserRepository,
    ) {}

    public async findAll(
        searchParams: IArticleSearchParams,
        user?: AuthedRequestPayload,
        feedType: ArticleFeedType = ArticleFeedType.GLOBAL,
    ) {
        const articles = await this.articleRepository.findAll(
            searchParams,
            user,
            feedType,
        )

        return articles
    }

    public async findBySlug(
        slug: string,
        user?: AuthedRequestPayload,
    ): Promise<ArticleDTO | null> {
        const article = await this.articleRepository.findOneBySlug(slug, user)
        return article
    }

    public async create(
        input: ICreateArticleInput,
        user: AuthedRequestPayload,
    ): Promise<ArticleDTO> {
        const { title, body, tagList, description } = input.article
        let slug = slugify(title, { lower: true })

        const existingArticle = await this.articleRepository.findOneBySlug(slug)

        if (existingArticle) {
            slug = slug + "-" + randomFillSync(Buffer.alloc(4)).toString("hex")
        }

        const author = await this.userRepository.findById(user.id)
        if (!author) throw new Error("Author not found")

        const article = await this.articleRepository.save(
            new ArticleEntity()
                .setTitle(title)
                .setSlug(slug)
                .setBody(body)
                .setDescription(description)
                .setTagList(tagList ?? [])
                .setAuthor(author),
        )

        return new ArticleDTO(article, user.id)
    }

    public async update(
        slug: string,
        input: IUpdateArticleInput,
        user: AuthedRequestPayload,
    ): Promise<ArticleDTO> {
        const { tagList, body, title, description } = input.article

        const article = await this.articleRepository.findOneBy({ slug: slug })
        if (!article) throw new Error("Article not found")

        if (article.author.id !== user.id) throw new NotArticleAuthorException()

        const newTagList = new Set([...article.tagList, ...(tagList ?? [])])

        article
            .setTitle(title)
            .setBody(body)
            .setDescription(description)
            .setTagList(Array.from(newTagList))

        void (await this.articleRepository.update({ id: article.id }, article))

        return new ArticleDTO(article, user.id)
    }

    public async delete(
        slug: string,
        user: AuthedRequestPayload,
    ): Promise<void> {
        const article = await this.articleRepository.findOneBy({ slug: slug })
        if (!article) throw new ArticleNotFoundException()

        if (article.author.id !== user.id) throw new NotArticleAuthorException()

        await this.articleRepository.delete({ id: article.id })
    }

    /**
     * @throws [UnauthorizedException, ArticleNotFoundException, UserAlreadyFavoritedArticleException]
     * */
    public async favorite(
        slug: string,
        user: AuthedRequestPayload,
    ): Promise<ArticleDTO> {
        const currentUser = await this.userRepository.findById(user.id)

        if (!currentUser) throw new UnauthorizedException()

        const article = await this.articleRepository.favoriteOneBySlug(
            slug,
            currentUser,
        )

        return article
    }

    /**
     * @throws [UnauthorizedException, ArticleNotFoundException, UserHasntFavoritedArticleException]
     * */
    public async unfavorite(
        slug: string,
        user: AuthedRequestPayload,
    ): Promise<ArticleDTO> {
        const currentUser = await this.userRepository.findById(user.id)

        if (!currentUser) throw new UnauthorizedException()

        const article = await this.articleRepository.unfavoriteOneBySlug(
            slug,
            currentUser,
        )

        return article
    }

    public async findAllTags(): Promise<string[]> {
        const tags = await this.articleRepository.findAllTags()
        return tags
    }
}
