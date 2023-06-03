import { DefaultDrizzlePgRepository } from "@/repositories/default-drizzle-pg"
import { user, User, InsertUser } from "@/users/users.model"
import { DrizzleService } from "@/drizzle/drizzle.service"
import { IUsersRepository } from "@/repositories"
import { Injectable } from "@nestjs/common"
import { eq } from "drizzle-orm"

@Injectable()
export class UsersRepository
    extends DefaultDrizzlePgRepository<typeof user, User, InsertUser>
    implements IUsersRepository
{
    constructor(drizzleService: DrizzleService) {
        super(user, drizzleService)
    }

    public async findByEmail(email: string): Promise<User | null> {
        const [found] = await this.drizzleService.database
            .select()
            .from(user)
            .where(eq(user.email, email))
            .limit(1)

        return found || null
    }

    public async findByName(name: string): Promise<User | null> {
        const [found] = await this.drizzleService.database
            .select()
            .from(user)
            .where(eq(user.name, name))
            .limit(1)

        return found || null
    }
}
