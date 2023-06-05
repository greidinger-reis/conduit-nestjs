import {
    AuthedRequest,
    AuthGuard,
    OptionalAuthGuard,
    OptionalAuthedRequest,
} from "@/auth/auth.guard"
import { TypedBody, TypedParam, TypedQuery, TypedRoute } from "@nestia/core"
import { Controller, Req, UseGuards } from "@nestjs/common"
import { CreateArticleDTO } from "./article.model"
import { IArticleQuery } from "./article.query"
import { ArticleService } from "./article.service"

@Controller("articles")
export class ArticleController {
    constructor(private readonly articleService: ArticleService) {}

    @UseGuards(OptionalAuthGuard)
    @TypedRoute.Get()
    async getAllArticles(
        @TypedQuery() query: IArticleQuery,
        @Req() req: OptionalAuthedRequest,
    ) {
        const articles = await this.articleService.findAll(query, req.user?.id)

        return { articles: articles, articlesCount: articles.length }
    }

    @UseGuards(AuthGuard)
    @TypedRoute.Get("feed")
    async getFeedArticles(
        @TypedQuery() query: IArticleQuery,
        @Req() req: AuthedRequest,
    ) {
        const articles = await this.articleService.findAll(
            query,
            req.user.id,
            "feed",
        )

        return { articles: articles, articlesCount: articles.length }
    }

    @UseGuards(OptionalAuthGuard)
    @TypedRoute.Get(":slug")
    async getArticle(
        @TypedParam("slug") slug: string,
        @Req() req: OptionalAuthedRequest,
    ) {
        const article = await this.articleService.findBySlug(slug, req.user?.id)

        return { article: article }
    }

    @UseGuards(AuthGuard)
    @TypedRoute.Post()
    async createArticle(
        @TypedBody() body: { article: CreateArticleDTO },
        @Req() req: AuthedRequest,
    ) {
        const article = await this.articleService.create(body.article, req.user)

        return { article: article }
    }

    @UseGuards(AuthGuard)
    @TypedRoute.Put(":slug")
    async updateArticle(
        @TypedParam("slug") slug: string,
        @TypedBody() body: { article: Partial<CreateArticleDTO> },
        @Req() req: AuthedRequest,
    ) {
        const article = await this.articleService.update(
            slug,
            body.article,
            req.user,
        )

        return { article: article }
    }
}
