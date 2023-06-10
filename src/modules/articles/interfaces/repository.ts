import { AuthedRequestPayload } from "@/modules/auth/interfaces/auth-payload"
import { IUserEntity } from "@/modules/user/interfaces/entity"
import { ArticleRO, _ArticleRO } from "../article.dto"
import { IArticleSearchParams } from "./search-params"

export enum ArticleFeedType {
    GLOBAL = "global",
    FEED = "feed",
}

export interface IArticleRepository {
    findOneBySlug(
        slug: string,
        user?: AuthedRequestPayload,
    ): Promise<ArticleRO | null>
    findAll(
        searchParams: IArticleSearchParams,
        user?: AuthedRequestPayload,
        feedType?: ArticleFeedType,
    ): Promise<_ArticleRO[]>

    favoriteOneBySlug(slug: string, user?: IUserEntity): Promise<ArticleRO>

    unfavoriteOneBySlug(slug: string, user?: IUserEntity): Promise<ArticleRO>
    findAllTags(): Promise<string[]>
}
