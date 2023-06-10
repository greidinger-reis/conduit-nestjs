import { AuthedRequestPayload } from "@/modules/auth/interfaces/auth-payload"
import { IUserEntity } from "@/modules/user/interfaces/entity"
import { ArticleDTO } from "../article.dto"
import { IArticleSearchParams } from "./search-params"

export enum ArticleFeedType {
    GLOBAL = "global",
    FEED = "feed",
}

export interface IArticleRepository {
    findOneBySlug(
        slug: string,
        user?: AuthedRequestPayload,
    ): Promise<ArticleDTO | null>
    findAll(
        searchParams: IArticleSearchParams,
        user?: AuthedRequestPayload,
        feedType?: ArticleFeedType,
    ): Promise<ArticleDTO[]>

    favoriteOneBySlug(
        slug: string,
        user?: IUserEntity,
    ): Promise<ArticleDTO>

    unfavoriteOneBySlug(
        slug: string,
        user?: IUserEntity,
    ): Promise<ArticleDTO>

    findAllTags(): Promise<string[]>
}
