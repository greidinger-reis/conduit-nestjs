import { AuthModule } from "@/modules/auth/auth.module"
import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { UserController, UsersController } from "./user.controller"
import { UserEntity } from "./user.entity"
import { UserRepository } from "./user.repository"
import { UserService } from "./user.service"

@Module({
    imports: [AuthModule, TypeOrmModule.forFeature([UserEntity])],
    controllers: [UserController, UsersController],
    providers: [UserService, UserRepository],
    exports: [UserService, UserRepository],
})
export class UsersModule {}
