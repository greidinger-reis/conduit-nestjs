import { IUserEntity } from "@/modules/user/interfaces/entity"
import { ArticleDTO } from "../article.dto"
import { IArticleSearchParams } from "./search-params"

export interface IArticleRepository {
    findOneBySlug(
        slug: string,
        currentUserId?: string,
    ): Promise<ArticleDTO | null>
    findAll(
        searchParams: IArticleSearchParams,
        currentUserId?: string,
        type?: "global" | "feed",
    ): Promise<ArticleDTO[]>

    favoriteOneBySlug(
        slug: string,
        currentUser: IUserEntity,
    ): Promise<ArticleDTO>
}
