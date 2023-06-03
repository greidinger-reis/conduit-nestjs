import { DefaultDrizzlePgRepository } from "@/repositories/default-drizzle-pg"
import { user, User, InsertUser } from "@/users/users.model"
import { DrizzleService } from "@/drizzle/drizzle.service"
import { UsersRepository as IUsersRepository } from "@/repositories"
import { eq } from "drizzle-orm"
import { ParseDates } from "@/utils/parse-dates"

export class UsersRepository
    extends DefaultDrizzlePgRepository<typeof user, User, InsertUser>
    implements IUsersRepository
{
    constructor(drizzleService: DrizzleService) {
        super(user, drizzleService)
    }

    @ParseDates
    public async findByEmail(email: string): Promise<User | null> {
        const [found] = await this.drizzleService.database
            .select()
            .from(user)
            .where(eq(user.email, email))
            .limit(1)

        return (found as unknown as User) || null
    }
}
