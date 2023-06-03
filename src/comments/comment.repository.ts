import { Comment, InsertComment, comment } from "@/comments/comment.model"
import { DefaultDrizzlePgRepository } from "@/repositories/default-drizzle-pg"
import { DrizzleService } from "@/drizzle/drizzle.service"

export class CommentRepository extends DefaultDrizzlePgRepository<
    typeof comment,
    Comment,
    InsertComment
> {
    constructor(drizzleService: DrizzleService) {
        super(comment, drizzleService)
    }
}
