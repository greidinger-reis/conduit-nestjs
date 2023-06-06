import { AbstractEntity } from "@/common/abstract.entity"
import { Column, Entity, ManyToOne } from "typeorm"
import { ArticleEntity } from "../articles/article.entity"
import { UserEntity } from "../user/user.entity"
import { ICommentEntity } from "./interfaces/entity"

@Entity({ name: "comment" })
export class CommentEntity extends AbstractEntity implements ICommentEntity {
    @Column({ type: "text" })
    body: string

    @ManyToOne(() => UserEntity, (user) => user.comments)
    author: UserEntity

    @ManyToOne(() => ArticleEntity, (article) => article.comments)
    article: ArticleEntity
}
