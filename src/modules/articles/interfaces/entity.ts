import { IAbstractEntity } from "@/common/abstract.entity"
import { ICommentEntity } from "@/modules/comment/interfaces/entity"
import { IUserEntity } from "@/modules/user/interfaces/entity"

export interface IArticleEntity extends IAbstractEntity {
    /**
     * @minLength 3
     * @maxlength 256
     * */
    title: string
    /**
     * @maxlength 256
     * */
    slug: string

    description: string

    body: string
    /**
     * maxItems(5)
     * */
    tagList: string[]

    author: IUserEntity

    comments: ICommentEntity[]
}
