import { IAbstractEntity } from "@/common/abstract.entity"
import { IArticleEntity } from "@/modules/articles/interfaces/entity"
import { ICommentEntity } from "@/modules/comment/interfaces/entity"

export interface IUserEntity extends IAbstractEntity {
    /**
     * @pattern ^[a-zA-Z0-9]+$
     * @minLength 3
     * @maxLength 16
     */
    name: string
    /**
     * @format email
     * @maxLength 255
     */
    email: string

    emailVerifiedAt: Date | null
    /**
     * @pattern ^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+{};:,<.>]).+$
     * @minLength 8
     * @maxLength 255
     */
    password: string
    /**
     * @maxLength 255
     * */
    image: string | null

    bio: string | null

    articles: IArticleEntity[]

    following: IUserEntity[]

    followers: IUserEntity[]

    favorites: IArticleEntity[]

    comments: ICommentEntity[]
}
