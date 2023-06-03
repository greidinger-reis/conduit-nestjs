import { Favorite, InsertFavorite, favorite } from "@/models/favorite"
import { DefaultDrizzlePgRepository } from "./default-drizzle-pg"
import { DrizzleService } from "@/drizzle/drizzle.service"

export class FavoriteRepository extends DefaultDrizzlePgRepository<
    typeof favorite,
    Favorite,
    InsertFavorite
> {
    constructor(drizzleService: DrizzleService) {
        super(favorite, drizzleService)
    }
}
