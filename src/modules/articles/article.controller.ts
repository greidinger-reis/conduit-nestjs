import {
    AuthedRequest,
    AuthGuard,
    OptionalAuthedRequest,
    OptionalAuthGuard,
} from "@/modules/auth/auth.guard"
import { TypedBody, TypedParam, TypedQuery, TypedRoute } from "@nestia/core"
import {
    Controller,
    HttpException,
    HttpStatus,
    Req,
    UseGuards,
} from "@nestjs/common"
import { ArticleService } from "./article.service"
import {
    ArticleNotFoundException,
    NotArticleAuthorException,
    UserAlreadyFavoritedArticleException,
    UserHasntFavoritedArticleException,
} from "./exceptions"
import { ICreateArticleInput } from "./inputs/create"
import { IUpdateArticleInput } from "./inputs/update"
import { ArticleFeedType } from "./interfaces/repository"
import { IArticleSearchParams } from "./interfaces/search-params"

@Controller("articles")
export class ArticleController {
    constructor(private readonly articleService: ArticleService) {}

    @UseGuards(OptionalAuthGuard)
    @TypedRoute.Get()
    async getAllArticles(
        @TypedQuery() searchParams: IArticleSearchParams,
        @Req() req: OptionalAuthedRequest,
    ) {
        console.log(searchParams)
        const articles = await this.articleService.findAll(
            searchParams,
            req.user,
            ArticleFeedType.GLOBAL,
        )

        return { articles: articles, articlesCount: articles.length }
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
    @TypedRoute.Get("feed")
    async getFeedArticles(
        @TypedQuery() searchParams: IArticleSearchParams,
        @Req() req: AuthedRequest,
    ) {
        const articles = await this.articleService.findAll(
            searchParams,
            req.user,
            ArticleFeedType.FEED,
        )

        return { articles: articles, articlesCount: articles.length }
    }

    @UseGuards(OptionalAuthGuard)
    @TypedRoute.Get(":slug")
    async getArticle(
        @TypedParam("slug") slug: string,
        @Req() req: OptionalAuthedRequest,
    ) {
        const article = await this.articleService.findBySlug(slug, req.user)

        return { article: article }
    }

    @UseGuards(AuthGuard)
    @TypedRoute.Delete(":slug")
    async deleteArticle(
        @TypedParam("slug") slug: string,
        @Req() req: AuthedRequest,
    ) {
        try {
            void (await this.articleService.delete(slug, req.user))
        } catch (error) {
            if (error instanceof NotArticleAuthorException) {
                throw new HttpException(
                    { status: HttpStatus.FORBIDDEN, error: error.message },
                    HttpStatus.FORBIDDEN,
                )
            }
            if (error instanceof ArticleNotFoundException) {
                throw new HttpException(
                    { status: HttpStatus.NOT_FOUND, error: error.message },
                    HttpStatus.NOT_FOUND,
                )
            }
            throw new HttpException(
                {
                    status: HttpStatus.INTERNAL_SERVER_ERROR,
                    error: (error as Error).message,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            )
        }

        return
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

    @UseGuards(AuthGuard)
    @TypedRoute.Post(":slug/favorite")
    async favoriteArticle(
        @TypedParam("slug") slug: string,
        @Req() req: AuthedRequest,
    ) {
        try {
            const article = await this.articleService.favorite(slug, req.user)
            return { article: article }
        } catch (error) {
            if (error instanceof ArticleNotFoundException) {
                throw new HttpException(
                    {
                        status: HttpStatus.NOT_FOUND,
                        error: error.message,
                    },
                    HttpStatus.NOT_FOUND,
                )
            }
            if (error instanceof UserAlreadyFavoritedArticleException) {
                throw new HttpException(
                    {
                        status: HttpStatus.FORBIDDEN,
                        error: error.message,
                    },
                    HttpStatus.FORBIDDEN,
                )
            }
            throw new HttpException(
                {
                    status: HttpStatus.INTERNAL_SERVER_ERROR,
                    error: (error as Error).message,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            )
        }
    }
    @UseGuards(AuthGuard)
    @TypedRoute.Delete(":slug/favorite")
    async unfavoriteArticle(
        @TypedParam("slug") slug: string,
        @Req() req: AuthedRequest,
    ) {
        try {
            const article = await this.articleService.unfavorite(slug, req.user)
            return { article: article }
        } catch (error) {
            if (error instanceof ArticleNotFoundException) {
                throw new HttpException(
                    {
                        status: HttpStatus.NOT_FOUND,
                        error: error.message,
                    },
                    HttpStatus.NOT_FOUND,
                )
            }
            if (error instanceof UserHasntFavoritedArticleException) {
                throw new HttpException(
                    {
                        status: HttpStatus.FORBIDDEN,
                        error: error.message,
                    },
                    HttpStatus.FORBIDDEN,
                )
            }
            throw new HttpException(
                {
                    status: HttpStatus.INTERNAL_SERVER_ERROR,
                    error: (error as Error).message,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            )
        }
    }
}

@Controller("tags")
export class TagController {
    constructor(private readonly articleService: ArticleService) {}

    @TypedRoute.Get()
    public async getAllTags() {
        const tags = await this.articleService.findAllTags()

        return { tags: tags }
    }
}
