import { Injectable } from "@nestjs/common"
import { ArticleRepository } from "../articles/article.repository"
import { ArticleNotFoundException } from "../articles/exceptions"
import { AuthedRequestPayload } from "../auth/interfaces/auth-payload"
import { UserNotFoundException } from "../user/exceptions"
import { UserRepository } from "../user/user.repository"
import { CommentRO } from "./comment.dto"
import { CommentEntity } from "./comment.entity"
import { CommentRepository } from "./comment.repository"
import {
    CommentNotFoundException,
    NotCommentAuthorException,
} from "./exceptions"
import { CreateCommentDTO } from "./inputs/create"

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
        input: CreateCommentDTO,
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

        const comment = new CommentEntity({
            body: input.comment.body,
            author: authorEntity,
            article: articleEntity,
        })

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
