import { follow, Follow, InsertFollow } from "@/follows/follow.model"
import { DefaultDrizzlePgRepository } from "@/repositories/default-drizzle-pg"
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
