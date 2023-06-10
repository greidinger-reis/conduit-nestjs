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
import { ApiBody, ApiCreatedResponse, ApiHeader, ApiOkResponse, ApiOperation, ApiQuery, ApiTags, ApiUnauthorizedResponse } from "@nestjs/swagger"
import { CommentRO } from "../comment/comment.dto"
import { CommentService } from "../comment/comment.service"
import {
    CommentNotFoundException,
    NotCommentAuthorException,
} from "../comment/exceptions"
import { ICreateCommentInput } from "../comment/inputs/create"
import { _ArticleRO, MultipleArticlesRO, ArticleRO } from "./article.dto"
import { ArticleService } from "./article.service"
import {
    ArticleNotFoundException,
    NotArticleAuthorException,
    UserAlreadyFavoritedArticleException,
    UserHasntFavoritedArticleException,
} from "./exceptions"
import { CreateArticleDTO, ICreateArticleDTO } from "./inputs/create"
import { IUpdateArticleInput } from "./inputs/update"
import { ArticleFeedType } from "./interfaces/repository"
import { IArticleSearchParams } from "./interfaces/search-params"

@Controller("articles")
@ApiTags("articles")
export class ArticleController {
    constructor(
        private readonly articleService: ArticleService,
        private readonly commentService: CommentService,
    ) {}

    @TypedRoute.Get()
    @UseGuards(OptionalAuthGuard)
    @ApiOperation({ summary: "Get all articles" })
    @ApiQuery({
        name: "tag",
        required: false,
        description: "Filter by tag",
    })
    @ApiQuery({
        name: "author",
        required: false,
        description: "Filter by author",
    })
    @ApiQuery({
        name: "favorited",
        required: false,
        description: "Filter articles favorited by user",
    })
    @ApiQuery({
        name: "limit",
        required: false,
        description: "Limit number of articles (default is 20)",
    })
    @ApiQuery({
        name: "offset",
        required: false,
        description: "Offset/skip number of articles (default is 0)",
    })
    @ApiOkResponse({
        description: "Articles",
        type: MultipleArticlesRO,
    })
    async getAllArticles(
        @TypedQuery() searchParams: IArticleSearchParams,
        @Req() req: OptionalAuthedRequest,
    ): Promise<MultipleArticlesRO> {
        console.log(searchParams)
        const articles = await this.articleService.findAll(
            searchParams,
            req.user,
            ArticleFeedType.GLOBAL,
        )

        return new MultipleArticlesRO(articles)
    }

    @TypedRoute.Post()
    @UseGuards(AuthGuard)
    @ApiOperation({ summary: "Create article" })
    @ApiHeader({
        name: "Authorization",
        description: "JWT token",
        example: "Token jwt.token.here",
    })
    @ApiBody({
        description: "Create article input",
        type: CreateArticleDTO,
    })
    @ApiUnauthorizedResponse({
        description: "Unauthorized",
    })
    @ApiCreatedResponse({
        description: "Article",
        type: ArticleRO,
    })
    async createArticle(
        @TypedBody() input: CreateArticleDTO,
        @Req() req: AuthedRequest,
    ): Promise<ArticleRO> {
        const article = await this.articleService.create(input, req.user)

        return { article: article }
    }

    @TypedRoute.Get("feed")
    @UseGuards(AuthGuard)
    @ApiOperation({ summary: "Get feed of articles for current user" })
    @ApiHeader({
        name: "Authorization",
        description: "JWT token",
        example: "Token jwt.token.here",
    })
    @ApiQuery({
        name: "tag",
        required: false,
        description: "Filter by tag",
    })
    @ApiQuery({
        name: "author",
        required: false,
        description: "Filter by author",
    })
    @ApiQuery({
        name: "favorited",
        required: false,
        description: "Filter articles favorited by user",
    })
    @ApiQuery({
        name: "limit",
        required: false,
        description: "Limit number of articles (default is 20)",
    })
    @ApiQuery({
        name: "offset",
        required: false,
        description: "Offset/skip number of articles (default is 0)",
    })
    @ApiUnauthorizedResponse({
        description: "Unauthorized",
    })
    async getFeedArticles(
        @TypedQuery() searchParams: IArticleSearchParams,
        @Req() req: AuthedRequest,
    ): Promise<MultipleArticlesRO> {
        const articles = await this.articleService.findAll(
            searchParams,
            req.user,
            ArticleFeedType.FEED,
        )

        return new MultipleArticlesRO(articles)
    }

    @UseGuards(OptionalAuthGuard)
    @TypedRoute.Get(":slug")
    async getArticle(
        @TypedParam("slug") slug: string,
        @Req() req: OptionalAuthedRequest,
    ): Promise<ArticleRO | null> {
        const article = await this.articleService.findBySlug(slug, req.user)
        return article
    }

    @UseGuards(AuthGuard)
    @TypedRoute.Delete(":slug")
    async deleteArticle(
        @TypedParam("slug") slug: string,
        @Req() req: AuthedRequest,
    ): Promise<void> {
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
    ): Promise<{ article: _ArticleRO }> {
        const article = await this.articleService.update(slug, input, req.user)

        return { article: article }
    }

    @UseGuards(AuthGuard)
    @TypedRoute.Post(":slug/favorite")
    async favoriteArticle(
        @TypedParam("slug") slug: string,
        @Req() req: AuthedRequest,
    ): Promise<{ article: _ArticleRO }> {
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
    ): Promise<{ article: _ArticleRO }> {
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

    @UseGuards(OptionalAuthGuard)
    @TypedRoute.Get(":slug/comments")
    async getComments(
        @TypedParam("slug") slug: string,
        @Req() req: OptionalAuthedRequest,
    ): Promise<{ comments: CommentRO[] }> {
        const comments = await this.commentService.findAllByArticleSlug(
            slug,
            req.user,
        )

        return { comments: comments }
    }

    @UseGuards(AuthGuard)
    @TypedRoute.Post(":slug/comments")
    async createComment(
        @TypedParam("slug") slug: string,
        @TypedBody() input: ICreateCommentInput,
        @Req() req: AuthedRequest,
    ): Promise<{ comment: CommentRO }> {
        const comment = await this.commentService.create(slug, input, req.user)

        return { comment: comment }
    }

    @UseGuards(AuthGuard)
    @TypedRoute.Delete(":slug/comments/:id")
    async deleteComment(
        @TypedParam("slug") slug: string,
        @TypedParam("id") id: string,
        @Req() req: AuthedRequest,
    ): Promise<void> {
        try {
            console.log({ slug, id })
            void (await this.commentService.delete(slug, id, req.user))
        } catch (error) {
            if (error instanceof NotCommentAuthorException) {
                throw new HttpException(
                    { status: HttpStatus.FORBIDDEN, error: error.message },
                    HttpStatus.FORBIDDEN,
                )
            }
            if (error instanceof CommentNotFoundException) {
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
}

@Controller("tags")
@ApiTags("tags")
export class TagController {
    constructor(private readonly articleService: ArticleService) {}

    @TypedRoute.Get()
    public async getAllTags(): Promise<{ tags: string[] }> {
        const tags = await this.articleService.findAllTags()

        return { tags: tags }
    }
}
