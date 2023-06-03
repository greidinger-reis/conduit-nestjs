import { follow, Follow, InsertFollow } from "@/models/follow"
import { DefaultDrizzlePgRepository } from "./default-drizzle-pg"
import { DrizzleService } from "@/drizzle/drizzle.service"

export class FollowRepository extends DefaultDrizzlePgRepository<
    typeof follow,
    Follow,
    InsertFollow
> {
    constructor(drizzleService: DrizzleService) {
        super(follow, drizzleService)
    }
}
