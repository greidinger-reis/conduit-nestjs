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
import {
    ApiBody,
    ApiCreatedResponse,
    ApiForbiddenResponse,
    ApiHeader,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    ApiParam,
    ApiQuery,
    ApiTags,
    ApiUnauthorizedResponse,
} from "@nestjs/swagger"
import { CommentRO } from "../comment/comment.dto"
import { CommentService } from "../comment/comment.service"
import {
    CommentNotFoundException,
    NotCommentAuthorException,
} from "../comment/exceptions"
import { CreateCommentDTO } from "../comment/inputs/create"
import { ArticleRO, MultipleArticlesRO } from "./article.dto"
import { ArticleService } from "./article.service"
import {
    ArticleNotFoundException,
    NotArticleAuthorException,
    UserAlreadyFavoritedArticleException,
    UserHasntFavoritedArticleException,
} from "./exceptions"
import { CreateArticleDTO } from "./inputs/create"
import { UpdateArticleDTO } from "./inputs/update"
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

        return article
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

    @TypedRoute.Get(":slug")
    @UseGuards(OptionalAuthGuard)
    @ApiOperation({ summary: "Get article by slug" })
    @ApiParam({
        name: "slug",
        required: true,
        description: "Article slug",
    })
    @ApiOkResponse({
        description: "Article",
        type: ArticleRO,
        schema: {
            type: "object",
            nullable: true,
        },
    })
    async getArticle(
        @TypedParam("slug") slug: string,
        @Req() req: OptionalAuthedRequest,
    ): Promise<ArticleRO | null> {
        return await this.articleService.findBySlug(slug, req.user)
    }

    @TypedRoute.Delete(":slug")
    @UseGuards(AuthGuard)
    @ApiOperation({ summary: "Delete article by slug" })
    @ApiHeader({
        name: "Authorization",
        description: "JWT token",
        example: "Token jwt.token.here",
    })
    @ApiParam({
        name: "slug",
        required: true,
        description: "Article slug",
    })
    @ApiUnauthorizedResponse({
        description: "Unauthorized",
    })
    @ApiNotFoundResponse({
        description: "Article not found",
    })
    @ApiForbiddenResponse({
        description: "Forbidden",
    })
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
    }

    @TypedRoute.Put(":slug")
    @UseGuards(AuthGuard)
    @ApiOperation({ summary: "Update article by slug" })
    @ApiHeader({
        name: "Authorization",
    })
    @ApiParam({
        name: "slug",
        required: true,
        description: "Article slug",
    })
    @ApiBody({
        description: "Update article input",
        type: UpdateArticleDTO,
    })
    @ApiUnauthorizedResponse({
        description: "Unauthorized",
    })
    @ApiNotFoundResponse({
        description: "Article not found",
    })
    @ApiForbiddenResponse({
        description: "Forbidden",
    })
    async updateArticle(
        @TypedParam("slug") slug: string,
        @TypedBody() input: UpdateArticleDTO,
        @Req() req: AuthedRequest,
    ): Promise<ArticleRO> {
        return await this.articleService.update(slug, input, req.user)
    }

    @TypedRoute.Post(":slug/favorite")
    @UseGuards(AuthGuard)
    @ApiOperation({ summary: "Favorite article by slug" })
    @ApiHeader({
        name: "Authorization",
        description: "JWT token",
    })
    @ApiParam({
        name: "slug",
        required: true,
        description: "Article slug",
    })
    @ApiUnauthorizedResponse({
        description: "Unauthorized",
    })
    @ApiNotFoundResponse({
        description: "Article not found",
    })
    @ApiForbiddenResponse({
        description: "Forbidden",
    })
    async favoriteArticle(
        @TypedParam("slug") slug: string,
        @Req() req: AuthedRequest,
    ): Promise<ArticleRO> {
        try {
            return await this.articleService.favorite(slug, req.user)
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
    @TypedRoute.Delete(":slug/favorite")
    @UseGuards(AuthGuard)
    @ApiOperation({ summary: "Unfavorite article by slug" })
    @ApiHeader({
        name: "Authorization",
        description: "JWT token",
    })
    @ApiParam({
        name: "slug",
        required: true,
        description: "Article slug",
    })
    @ApiUnauthorizedResponse({
        description: "Unauthorized",
    })
    @ApiNotFoundResponse({
        description: "Article not found",
    })
    @ApiForbiddenResponse({
        description: "Forbidden",
    })
    async unfavoriteArticle(
        @TypedParam("slug") slug: string,
        @Req() req: AuthedRequest,
    ): Promise<ArticleRO> {
        try {
            return await this.articleService.unfavorite(slug, req.user)
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

    @TypedRoute.Get(":slug/comments")
    @UseGuards(OptionalAuthGuard)
    @ApiOperation({ summary: "Get comments by article slug" })
    @ApiParam({
        name: "slug",
        required: true,
        description: "Article slug",
    })
    @ApiOkResponse({
        description: "Comments",
        type: CommentRO,
        isArray: true,
    })
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

    @TypedRoute.Post(":slug/comments")
    @UseGuards(AuthGuard)
    @ApiOperation({ summary: "Create comment by article slug" })
    @ApiHeader({
        name: "Authorization",
        description: "JWT token",
        example: "Token jwt.token.here",
    })
    @ApiParam({
        name: "slug",
        required: true,
        description: "Article slug",
    })
    @ApiBody({
        description: "Create comment input",
        type: CreateCommentDTO,
    })
    @ApiUnauthorizedResponse({
        description: "Unauthorized",
    })
    @ApiNotFoundResponse({
        description: "Article not found",
    })
    @ApiOkResponse({
        description: "Comment",
        type: CommentRO,
    })
    async createComment(
        @TypedParam("slug") slug: string,
        @TypedBody() input: CreateCommentDTO,
        @Req() req: AuthedRequest,
    ): Promise<{ comment: CommentRO }> {
        const comment = await this.commentService.create(slug, input, req.user)

        return { comment: comment }
    }

    @TypedRoute.Delete(":slug/comments/:id")
    @UseGuards(AuthGuard)
    @ApiOperation({ summary: "Delete comment by article slug and comment id" })
    @ApiHeader({
        name: "Authorization",
        description: "JWT token",
    })
    @ApiParam({
        name: "slug",
        required: true,
        description: "Article slug",
    })
    @ApiParam({
        name: "id",
        required: true,
        description: "Comment id",
    })
    @ApiUnauthorizedResponse({
        description: "Unauthorized",
    })
    @ApiNotFoundResponse({
        description: "Article or comment not found",
    })
    @ApiForbiddenResponse({
        description: "Forbidden",
    })
    @ApiOkResponse()
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
    }
}

@Controller("tags")
@ApiTags("tags")
export class TagController {
    constructor(private readonly articleService: ArticleService) {}

    @TypedRoute.Get()
    @ApiOperation({ summary: "Get all tags" })
    @ApiOkResponse({
        description: "Tags",
        type: String,
        isArray: true,
    })
    public async getAllTags(): Promise<{ tags: string[] }> {
        const tags = await this.articleService.findAllTags()

        return { tags: tags }
    }
}
