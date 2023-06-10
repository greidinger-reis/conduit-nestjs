import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { AuthModule } from "../auth/auth.module"
import { CommentEntity } from "../comment/comment.entity"
import { CommentRepository } from "../comment/comment.repository"
import { CommentService } from "../comment/comment.service"
import { UserEntity } from "../user/user.entity"
import { UserRepository } from "../user/user.repository"
import { ArticleController, TagController } from "./article.controller"
import { ArticleEntity } from "./article.entity"
import { ArticleRepository } from "./article.repository"
import { ArticleService } from "./article.service"

@Module({
    imports: [
        AuthModule,
        TypeOrmModule.forFeature([ArticleEntity, UserEntity, CommentEntity]),
    ],
    controllers: [ArticleController, TagController],
    providers: [
        UserRepository,
        ArticleRepository,
        CommentRepository,
        ArticleService,
        CommentService,
    ],
})
export class ArticlesModule {}
