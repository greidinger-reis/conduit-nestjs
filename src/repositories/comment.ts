import { Comment, InsertComment, comment } from "@/models/comment"
import { DefaultDrizzlePgRepository } from "./default-drizzle-pg"
import { DrizzleService } from "@/drizzle/drizzle.service"

export class CommentRepository extends DefaultDrizzlePgRepository<
    typeof comment,
    Comment,
    InsertComment
> {
    constructor(drizzleService: DrizzleService) {
        super(comment,drizzleService)
    }
}
