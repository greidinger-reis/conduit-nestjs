import { InsertTag, Tag, tag } from "@/models/tag"
import { DefaultDrizzlePgRepository } from "./default-drizzle-pg"
import { DrizzleService } from "@/drizzle/drizzle.service"

export class TagRepository extends DefaultDrizzlePgRepository<
    typeof tag,
    Tag,
    InsertTag
> {
    constructor(drizzleService:DrizzleService) {
        super(tag, drizzleService)
    }
}
