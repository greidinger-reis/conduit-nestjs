import { Module } from "@nestjs/common"
import { ConfigModule, ConfigService } from "@nestjs/config"
import { TypeOrmModule } from "@nestjs/typeorm"
import { Config, defaultConfig } from "config/configuration"
import { ArticleEntity } from "./modules/articles/article.entity"
import { ArticlesModule } from "./modules/articles/article.module"
import { CommentEntity } from "./modules/comment/comment.entity"
import { UserEntity } from "./modules/user/user.entity"
import { UsersModule } from "./modules/user/user.module"
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler"
import { APP_GUARD } from "@nestjs/core"

@Module({
    imports: [
        ThrottlerModule.forRoot({
            ttl: 60,
            limit: 10,
        }),
        ConfigModule.forRoot({
            isGlobal: true,
            load: [defaultConfig],
        }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => {
                const databaseUrl =
                    configService.getOrThrow<Config["DATABASE_URL"]>(
                        "DATABASE_URL",
                    )
                return {
                    url: databaseUrl,
                    type: "postgres",
                    entities: [UserEntity, ArticleEntity, CommentEntity],
                    synchronize: true,
                }
            },
            inject: [ConfigService],
        }),
        UsersModule,
        ArticlesModule,
    ],
    controllers: [],
    providers: [
        {
            provide: APP_GUARD,
            useClass: ThrottlerGuard,
        },
    ],
})
export class AppModule {}
