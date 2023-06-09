import { Injectable } from "@nestjs/common"
import { DataSource, Repository } from "typeorm"
import { AuthedRequestPayload } from "../auth/interfaces/auth-payload"
import { CommentRO } from "./comment.dto"
import { CommentEntity } from "./comment.entity"
import { ICommentRepository } from "./interfaces/repository"

@Injectable()
export class CommentRepository
    extends Repository<CommentEntity>
    implements ICommentRepository
{
    constructor(private readonly dataSource: DataSource) {
        super(CommentEntity, dataSource.createEntityManager())
    }

    public async findAllByArticleSlug(
        slug: string,
    ): Promise<CommentEntity[]> {
        const comments = await this.find({
            where: { article: { slug } },
            relations: ["author"],
        })

        return comments
    }
}
