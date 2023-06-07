import { AuthedRequestPayload } from "@/modules/auth/interfaces/auth-payload";
import { ICommentEntity } from "./entity";

export interface ICommentRepository {
    findAllByArticleSlug(
        slug: string,
        currentUser?: AuthedRequestPayload,
    ): Promise<ICommentEntity[]>
}
