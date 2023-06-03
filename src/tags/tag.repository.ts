import { InsertTag, Tag, tag } from "@/tags/tag.model"
import { DefaultDrizzlePgRepository } from "@/repositories/default-drizzle-pg"
import { DrizzleService } from "@/drizzle/drizzle.service"
import { Injectable } from "@nestjs/common"

@Injectable()
export class TagRepository extends DefaultDrizzlePgRepository<
    typeof tag,
    Tag,
    InsertTag
> {
    constructor(drizzleService:DrizzleService) {
        super(tag, drizzleService)
    }
}
