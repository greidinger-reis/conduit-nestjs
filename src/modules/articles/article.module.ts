import { Module } from "@nestjs/common"
import { ArticleController } from "./article.controller"
import { ArticleService } from "./article.service"
import { ArticleRepository } from "./article.repository"
import { TypeOrmModule } from "@nestjs/typeorm"
import { UserRepository } from "../user/user.repository"

@Module({
    imports: [TypeOrmModule.forFeature([ArticleRepository, UserRepository])],
    controllers: [ArticleController],
    providers: [ArticleService],
})
export class ArticlesModule {}
