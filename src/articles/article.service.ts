import { TagRepository } from "@/tags/tag.repository"
import { UserTokenDTO } from "@/users/users.model"
import { UsersRepository } from "@/users/users.repository"
import { Injectable } from "@nestjs/common"
import slugify from "slugify"
import { ArticleDTO, CreateArticleDTO } from "./article.model"
import { IArticleQuery } from "./article.query"
import { ArticleRepository } from "./article.repository"

@Injectable()
export class ArticleService {
    constructor(
        private readonly articleRepository: ArticleRepository,
        private readonly usersRepository: UsersRepository,
        private readonly tagsRepository: TagRepository,
    ) {}

    public async findAll(
        query: IArticleQuery,
        currentUserId = "",
        type: "global" | "feed" = "global",
    ) {
        const author = query.author
            ? (await this.usersRepository.findByName(query.author))?.id || ""
            : ""

        const favorited = query.favorited
            ? (await this.usersRepository.findByName(query.favorited))?.id || ""
            : ""

        const articles = await this.articleRepository.findAll(
            {
                author,
                favorited,
                tag: query.tag,
                limit: query.limit,
                offset: query.offset,
            },
            currentUserId,
            type,
        )

        return articles
    }

    public async findBySlug(slug: string, currentUserId = "") {
        const article = await this.articleRepository.findBySlug(
            slug,
            currentUserId,
        )
        return article
    }

    public async create(
        input: CreateArticleDTO,
        user: UserTokenDTO,
    ): Promise<ArticleDTO> {
        const slug = slugify(input.title, { lower: true })

        const existingArticle = await this.articleRepository.findBySlug(slug)

        if (existingArticle) throw new Error("Article with same title already exists")

        const article = await this.articleRepository.create({
            slug,
            title: input.title,
            body: input.body,
            description: input.description,
            authorId: user.id,
        })

        const insertTagPromises = []

        if (input.tagList) {
            for (const tag of input.tagList) {
                insertTagPromises.push(
                    this.tagsRepository.create({
                        name: tag,
                        articleId: article.id,
                    }),
                )
            }
        }

        await Promise.all(insertTagPromises)

        const articleWithTags = await this.articleRepository.findBySlug(slug)

        if (!articleWithTags) {
            throw new Error("Article created not found")
        }

        return articleWithTags
    }

    public async update(
        slug: string,
        input: Partial<CreateArticleDTO>,
        user: UserTokenDTO,
    ): Promise<ArticleDTO> {
        const articleId = await this.articleRepository.getArticleIdBySlug(slug)
        if (!articleId) throw new Error("Article not found")

        const article = await this.articleRepository.findById(articleId)
        if (!article) throw new Error("Article not found")

        if (article.authorId !== user.id)
            throw new Error("You are not the author of this article")

        void (await this.articleRepository.update(articleId, {
            title: input.title,
            slug: input.title
                ? slugify(input.title, { lower: true })
                : undefined,
            body: input.body,
            description: input.description,
        }))

        const existingTags = new Set(
            await this.tagsRepository
                .findAllByArticleId(articleId)
                .then((tags) => tags.map((tag) => tag.name)),
        )

        const insertTagsPromises = []
        const removeTagsPromises = []

        // Insert new tags that are not in the old tag list
        if (input.tagList) {
            for (const tag of input.tagList) {
                if (!existingTags.has(tag)) {
                    insertTagsPromises.push(
                        this.tagsRepository
                            .create({
                                name: tag,
                                articleId,
                            })
                            .then(() => {}),
                    )
                }
            }

            const newTags = new Set(input.tagList)

            //Remove tags that are not in the new tag list
            for (const tag of existingTags) {
                if (!newTags.has(tag)) {
                    removeTagsPromises.push(
                        this.tagsRepository.deleteByArticleIdAndName(
                            articleId,
                            tag,
                        ),
                    )
                }
            }
        }

        await Promise.all(insertTagsPromises.concat(removeTagsPromises))

        const updatedArticle = await this.articleRepository.findBySlug(
            article.slug,
        )
        if (!updatedArticle) throw new Error("Article not found")

        return updatedArticle
    }
}
