import { Article, InsertArticle } from "@/models/article"
import { Comment, InsertComment } from "@/models/comment"
import { Favorite, InsertFavorite } from "@/models/favorite"
import { Follow, InsertFollow } from "@/models/follow"
import { InsertTag, Tag } from "@/models/tag"
import { InsertUser, User } from "@/models/user"

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

// This is the interfaces for the controllers
export interface ArticleRepository
    extends BaseRepository<Article, InsertArticle> {}
export interface UserRepository 
    extends BaseRepository<User, InsertUser> {}
export interface CommentRepository
    extends BaseRepository<Comment, InsertComment> {}
export interface FavoriteRepository
    extends BaseRepository<Favorite, InsertFavorite> {}
export interface FollowRepository
    extends BaseRepository<Follow, InsertFollow> {}
export interface TagRepository 
    extends BaseRepository<Tag, InsertTag> {}
