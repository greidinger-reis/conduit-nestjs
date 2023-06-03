import { Module } from "@nestjs/common"
import { UserController, UsersController } from "./users.controller"
import { UsersService } from "./users.service"
import { UsersRepository } from "./users.repository"
import { AuthService } from "@/auth/auth.service"
import { DrizzleService } from "@/drizzle/drizzle.service"

@Module({
    controllers: [UsersController, UserController],
    providers: [DrizzleService, AuthService, UsersRepository, UsersService],
})
export class UsersModule {}
