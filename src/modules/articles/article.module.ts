import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { AuthModule } from "../auth/auth.module"
import { UserEntity } from "../user/user.entity"
import { UserRepository } from "../user/user.repository"
import { ArticleController } from "./article.controller"
import { ArticleEntity } from "./article.entity"
import { ArticleRepository } from "./article.repository"
import { ArticleService } from "./article.service"

@Module({
    imports: [
        AuthModule,
        TypeOrmModule.forFeature([ArticleEntity, UserEntity]),
    ],
    controllers: [ArticleController],
    providers: [ArticleRepository, UserRepository, ArticleService],
})
export class ArticlesModule {}
