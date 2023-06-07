import { AbstractEntity } from "@/common/abstract.entity"
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm"
import { ArticleEntity } from "../articles/article.entity"
import { UserEntity } from "../user/user.entity"
import { ICommentEntity } from "./interfaces/entity"

@Entity({ name: "comment" })
export class CommentEntity extends AbstractEntity implements ICommentEntity {
    @Column({ type: "text" })
    body: string

    @ManyToOne(() => UserEntity, (user) => user.comments)
    @JoinColumn({ name: "author_id" })
    author: UserEntity

    @ManyToOne(() => ArticleEntity, (article) => article.comments)
    @JoinColumn({ name: "article_id" })
    article: ArticleEntity

    public setBody(body: string){
        this.body = body
        return this
    }

    public setAuthor(author: UserEntity){
        this.author = author
        return this
    }

    public setArticle(article: ArticleEntity){
        this.article = article
        return this
    }
}
