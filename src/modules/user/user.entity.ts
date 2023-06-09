import { AbstractEntity } from "@/common/abstract.entity"
import {
    BeforeInsert,
    BeforeUpdate,
    Column,
    Entity,
    JoinTable,
    ManyToMany,
    OneToMany,
} from "typeorm"
import { ArticleEntity } from "../articles/article.entity"
import { CommentEntity } from "../comment/comment.entity"
import { IUserEntity } from "./interfaces/entity"
import { hash } from "bcrypt"

@Entity({ name: "user" })
export class UserEntity extends AbstractEntity implements IUserEntity {
    @Column({ unique: true, length: 16 })
    name: string

    @Column({ unique: true, length: 255 })
    email: string

    @Column({ nullable: true, type: "timestamp", name: "email_verified_at" })
    emailVerifiedAt: Date | null

    @Column({ length: 255 })
    password: string

    @Column({ type: "varchar", nullable: true, length: 255 })
    image: string | null

    @Column({ nullable: true, type: "text" })
    bio: string | null

    @OneToMany(() => ArticleEntity, (article) => article.author)
    articles: ArticleEntity[]

    @OneToMany(() => CommentEntity, (comment) => comment.author)
    comments: CommentEntity[]

    @ManyToMany(() => UserEntity, (user) => user.followers)
    @JoinTable({
        joinColumn: {
            name: "followed_id",
        },
        inverseJoinColumn: {
            name: "follower_id",
        },
    })
    following: UserEntity[]

    @ManyToMany(() => UserEntity, (user) => user.following)
    followers: UserEntity[]

    @ManyToMany(() => ArticleEntity, (article) => article.favoritedBy)
    favorites: ArticleEntity[]

    @BeforeInsert()
    @BeforeUpdate()
    async hashPassword() {
        this.password = await hash(this.password, 12)
    }

    constructor(user: Partial<IUserEntity>) {
        super()
        Object.assign(this, user)
    }

    update(user: Partial<IUserEntity>) {
        Object.assign(this, user)
    }
}
