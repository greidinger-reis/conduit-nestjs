import { Module } from "@nestjs/common"
import { DrizzleModule } from "@/drizzle/drizzle.module"
import { ConfigModule } from "@nestjs/config"
import { defaultConfig } from "config/configuration"
import { AuthModule } from "@/auth/auth.module"
import { UsersModule } from "./users/users.module"
import { ArticlesModule } from "./articles/articles.module"

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [defaultConfig],
        }),
        DrizzleModule,
        AuthModule,
        UsersModule,
        ArticlesModule
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
