import { AbstractEntity } from "@/common/abstract.entity"
import { UserEntity } from "@/modules/user/user.entity"
import {
    Column,
    Entity,
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
        array: true,
        name: "tag_list",
        type: "simple-array",
        nullable: true,
    })
    tagList: string[]

    @ManyToOne(() => UserEntity, (author) => author.articles, { eager: true })
    //@ts-expect-error idk
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

    public setSlug(slug?: string) {
        if (!slug) return this

        this.slug = slug
        return this
    }

    public setTitle(title?: string) {
        if (!title) return this

        this.title = title
        return this
    }

    public setDescription(description?: string) {
        if (!description) return this

        this.description = description
        return this
    }

    public setBody(body?: string) {
        if (!body) return this

        this.body = body
        return this
    }

    public setTagList(tagList?: string[]) {
        if (!tagList) return this

        this.tagList = tagList
        return this
    }

    public setAuthor(author?: UserEntity) {
        if (!author) return this

        this.author = author
        return this
    }
}
