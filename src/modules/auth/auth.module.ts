import { Module } from "@nestjs/common"
import { AuthService } from "./auth.service"
import { JwtModule } from "@nestjs/jwt"
import { ConfigModule, ConfigService } from "@nestjs/config"
import { Config } from "config/configuration"
import { randomUUID } from "node:crypto"

@Module({
    imports: [
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            global: true,
            useFactory: async (configService: ConfigService) => ({
                global: true,
                secret: configService.getOrThrow<Config["JWT_SECRET"]>(
                    "JWT_SECRET",
                ),
                signOptions: {
                    expiresIn: configService.getOrThrow<
                        Config["JWT_EXPIRATION_TIME"]
                    >("JWT_EXPIRATION_TIME").string,
                    algorithm: "HS256",
                    jwtid: randomUUID(),
                },

                verifyOptions: {
                    algorithms: ["HS256"],
                },
            }),
        }),
    ],
    providers: [AuthService],
    exports: [AuthService],
})
export class AuthModule {}
