import { AbstractEntity } from "@/common/abstract.entity"
import { UserEntity } from "@/modules/user/user.entity"
import {
    Column,
    Entity,
    JoinColumn,
    JoinTable,
    ManyToMany,
    ManyToOne,
    OneToMany,
} from "typeorm"
import { CommentEntity } from "../comment/comment.entity"
import { IArticleEntity } from "./interfaces/entity"

@Entity({ name: "article" })
export class ArticleEntity extends AbstractEntity implements IArticleEntity {
    @Column({ length: 256 })
    title: string

    @Column({ length: 256 })
    slug: string

    @Column({ type: "text" })
    description: string

    @Column({ type: "text" })
    body: string

    @Column({
        name: "tag_list",
        type: "varchar",
        length: 255,
        array: true,
        nullable: true,
    })
    tagList: string[]

    @ManyToOne(() => UserEntity, (author) => author.articles, {
        eager: true,
        onDelete: "CASCADE",
    })
    @JoinColumn({ name: "author_id" })
    author: UserEntity

    @ManyToMany(() => UserEntity, (user) => user.favorites)
    @JoinTable({
        joinColumn: {
            name: "article_id",
        },
        inverseJoinColumn: {
            name: "user_id",
        },
    })
    favoritedBy: UserEntity[]

    @OneToMany(() => CommentEntity, (comment) => comment.article)
    comments: CommentEntity[]

    constructor(article: Partial<ArticleEntity>) {
        super()
        Object.assign(this, article)
    }

    update(input: Partial<ArticleEntity>) {
        Object.assign(this, input)
    }
}
