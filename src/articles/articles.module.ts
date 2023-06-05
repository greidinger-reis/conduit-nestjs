import { Module } from "@nestjs/common"
import { ArticleController } from "./article.controller"
import { ArticleService } from "./article.service"
import { DrizzleService } from "@/drizzle/drizzle.service"
import { ArticleRepository } from "./article.repository"
import { UsersRepository } from "@/users/users.repository"
import { AuthService } from "@/auth/auth.service"

@Module({
    controllers: [ArticleController],
    providers: [
        DrizzleService,
        AuthService,
        ArticleRepository,
        UsersRepository,
        ArticleService,
    ],
})
export class ArticlesModule {}
