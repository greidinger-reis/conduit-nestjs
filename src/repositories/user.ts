import {DefaultDrizzlePgRepository} from "./default-drizzle-pg"
import { user, User, InsertUser } from "../models/user"
import { DrizzleService } from "@/drizzle/drizzle.service"

export class UserRepository extends DefaultDrizzlePgRepository<
    typeof user,
    User,
    InsertUser
> {
    constructor(drizzleService: DrizzleService) {
        super(user, drizzleService)
    }
}
