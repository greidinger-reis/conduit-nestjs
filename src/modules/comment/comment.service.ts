import { AuthedRequestPayload } from "../auth/interfaces/auth-payload"
import { CommentRO } from "./comment.dto"
import { CommentRepository } from "./comment.repository"
import { Injectable } from "@nestjs/common"
import { ICreateCommentInput } from "./inputs/create"
import { CommentEntity } from "./comment.entity"
import { UserRepository } from "../user/user.repository"
import { UserNotFoundException } from "../user/exceptions"
import { ArticleService } from "../articles/article.service"
import { ArticleRepository } from "../articles/article.repository"
import { ArticleNotFoundException } from "../articles/exceptions"
import {
    CommentNotFoundException,
    NotCommentAuthorException,
} from "./exceptions"

@Injectable()
export class CommentService {
    constructor(
        private readonly commentRepository: CommentRepository,
        private readonly userRepository: UserRepository,
        private readonly articleRepository: ArticleRepository,
    ) {}

    public async findAllByArticleSlug(
        slug: string,
        currentUser?: AuthedRequestPayload,
    ): Promise<CommentRO[]> {
        const comments = await this.commentRepository.findAllByArticleSlug(slug)

        return comments.map(
            (comment) => new CommentRO(comment, currentUser?.id),
        )
    }

    public async create(
        slug: string,
        input: ICreateCommentInput,
        currentUser: AuthedRequestPayload,
    ): Promise<CommentRO> {
        const authorEntity = await this.userRepository.findById(currentUser.id)
        if (!authorEntity) {
            throw new UserNotFoundException()
        }

        const articleEntity = await this.articleRepository.findOneBy({
            slug,
        })

        if (!articleEntity) {
            throw new ArticleNotFoundException()
        }

        const comment = new CommentEntity()
            .setBody(input.comment.body)
            .setAuthor(authorEntity)
            .setArticle(articleEntity)

        await this.commentRepository.save(comment)

        return new CommentRO(comment, currentUser.id)
    }

    public async delete(
        slug: string,
        id: string,
        currentUser: AuthedRequestPayload,
    ): Promise<void> {
        const [comment] = await this.commentRepository.find({
            where: {
                id,
                article: {
                    slug,
                },
            },
            relations: ["author"],
            take: 1,
        })

        if (!comment) {
            throw new CommentNotFoundException()
        }

        if (comment.author.id !== currentUser.id) {
            throw new NotCommentAuthorException()
        }

        await this.commentRepository.remove(comment)
    }
}
