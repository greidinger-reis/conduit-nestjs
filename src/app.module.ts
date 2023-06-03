import { Module } from "@nestjs/common"
import { AppController } from "./app.controller"
import { AppService } from "./app.service"
import { DrizzleModule } from "@/drizzle/drizzle.module"
import { ConfigModule } from "@nestjs/config"
import {defaultConfig} from "config/configuration"
import { AuthModule } from "@/auth/auth.module"

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [defaultConfig],
        }),
        DrizzleModule,
        AuthModule
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
