import {
    AuthedRequest,
    AuthGuard,
    OptionalAuthGuard,
    OptionalAuthedRequest,
} from "@/modules/auth/auth.guard"
import { TypedBody, TypedParam, TypedQuery, TypedRoute } from "@nestia/core"
import { Controller, Req, UseGuards } from "@nestjs/common"
import { IArticleSearchParams } from "./interfaces/search-params"
import { ArticleService } from "./article.service"
import { ICreateArticleInput } from "./inputs/create"
import { IUpdateArticleInput } from "./inputs/update"

@Controller("articles")
export class ArticleController {
    constructor(private readonly articleService: ArticleService) {}

    @UseGuards(OptionalAuthGuard)
    @TypedRoute.Get()
    async getAllArticles(
        @TypedQuery() searchParams: IArticleSearchParams,
        @Req() req: OptionalAuthedRequest,
    ) {
        const articles = await this.articleService.findAll(
            searchParams,
            req.user?.id,
        )

        return { articles: articles, articlesCount: articles.length }
    }

    @UseGuards(AuthGuard)
    @TypedRoute.Get("feed")
    async getFeedArticles(
        @TypedQuery() searchParams: IArticleSearchParams,
        @Req() req: AuthedRequest,
    ) {
        const articles = await this.articleService.findAll(
            searchParams,
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
        @TypedBody() input: ICreateArticleInput,
        @Req() req: AuthedRequest,
    ) {
        const article = await this.articleService.create(input, req.user)

        return { article: article }
    }

    @UseGuards(AuthGuard)
    @TypedRoute.Put(":slug")
    async updateArticle(
        @TypedParam("slug") slug: string,
        @TypedBody() input: IUpdateArticleInput,
        @Req() req: AuthedRequest,
    ) {
        const article = await this.articleService.update(slug, input, req.user)

        return { article: article }
    }
}
