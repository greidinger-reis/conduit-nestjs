import { Article, InsertArticle } from "@/articles/article.model"
import { Comment, InsertComment } from "@/comments/comment.model"
import { Favorite, InsertFavorite } from "@/favorites/favorite.model"
import { Follow, InsertFollow } from "@/follows/follow.model"
import { InsertTag, Tag } from "@/tags/tag.model"
import { InsertUser, User } from "@/users/users.model"

export interface BaseRepository<T, U extends Partial<T>> {
    create(data: U): Promise<T>
    update(id: string, data: U): Promise<T>
    delete(id: string): Promise<T>
    findAll(limit: number, offset: number): Promise<T[]>
    findById(id: string): Promise<T | null>
}

export abstract class Repository<T, U extends Partial<T>>
    implements BaseRepository<T, U>
{
    abstract update(id: string, data: U): Promise<T>
    abstract delete(id: string): Promise<T>
    abstract findAll(limit: number, offset: number): Promise<T[]>
    abstract findById(id: string): Promise<T | null>
    abstract create(data: U): Promise<T>
}

export interface IArticleRepository
    extends BaseRepository<Article, InsertArticle> {}

export interface IUsersRepository extends BaseRepository<User, InsertUser> {
    findByEmail(email: string): Promise<User | null>
    findByName(name: string): Promise<User | null>
}

export interface ICommentRepository
    extends BaseRepository<Comment, InsertComment> {}

export interface IFavoriteRepository
    extends BaseRepository<Favorite, InsertFavorite> {}

export interface IFollowRepository
    extends BaseRepository<Follow, InsertFollow> {}

export interface ITagRepository extends BaseRepository<Tag, InsertTag> {}
