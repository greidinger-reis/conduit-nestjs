import { AuthedRequest, AuthGuard, OptionalAuthGuard, OptionalAuthedRequest } from "@/auth/auth.guard"
import { TypedParam, TypedQuery, TypedRoute } from "@nestia/core"
import { Controller, Req, UseGuards } from "@nestjs/common"
import { IArticleQuery } from "./article.query"
import { ArticleService } from "./article.service"

@Controller("articles")
export class ArticleController {
    constructor(
        private readonly articleService: ArticleService,
    ) {}

    @UseGuards(OptionalAuthGuard)
    @TypedRoute.Get()
    async getAllArticles(@TypedQuery() query: IArticleQuery, @Req() req:OptionalAuthedRequest) {
        const articles = await this.articleService.findAll(query, req.token)

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
            req.token,
            "feed",
        )

        return { articles: articles, articlesCount: articles.length }
    }

    @UseGuards(OptionalAuthGuard)
    @TypedRoute.Get(":slug")
    async getArticle(
        @TypedParam("slug") slug: string,
        @Req() req: OptionalAuthedRequest,
    ){
        const article = await this.articleService.findBySlug(slug, req.token)

        return { article: article }
    }


}
