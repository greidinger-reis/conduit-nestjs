import { Injectable } from "@nestjs/common"
import { ArticleRepository } from "./article.repository"
import { IArticleQuery } from "./article.query"
import { UsersRepository } from "@/users/users.repository"

@Injectable()
export class ArticleService {
    constructor(
        private readonly articleRepository: ArticleRepository,
        private readonly usersRepository: UsersRepository,
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
}
