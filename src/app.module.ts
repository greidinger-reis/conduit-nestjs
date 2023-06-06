import { Module } from "@nestjs/common"
import { ConfigModule, ConfigService } from "@nestjs/config"
import { TypeOrmModule } from "@nestjs/typeorm"
import { Config, defaultConfig } from "config/configuration"
import { ArticleEntity } from "./modules/articles/article.entity"
import { CommentEntity } from "./modules/comment/comment.entity"
import { UserEntity } from "./modules/user/user.entity"

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [defaultConfig],
        }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => {
                const config =
                    configService.getOrThrow<Config["DATABASE"]>("DATABASE")
                return {
                    type: config.type,
                    host: config.host,
                    port: config.port,
                    username: config.username,
                    password: config.password,
                    database: config.name,
                    entities: [UserEntity, ArticleEntity, CommentEntity],
                    synchronize: true,
                }
            },
            inject: [ConfigService],
        }),
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
