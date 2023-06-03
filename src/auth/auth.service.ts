import { Injectable } from "@nestjs/common"
import bcrypt from "bcrypt"
import { jwtVerify, SignJWT } from "jose"
import { createId } from "@/utils/create-id"
import { ConfigService } from "@nestjs/config"
import { Config } from "config/configuration"

export interface JWTPayload {
    sub: string
    jti: string
    iat: number
    exp: number
}

@Injectable()
export class AuthService {
    private readonly JWT_SECRET: Config["JWT_SECRET"]
    private readonly JWT_EXPIRATION: Config["JWT_EXPIRATION_TIME"]

    constructor(private configService: ConfigService) {
        this.JWT_SECRET =
            this.configService.getOrThrow<Config["JWT_SECRET"]>("JWT_SECRET")
        this.JWT_EXPIRATION = this.configService.getOrThrow<
            Config["JWT_EXPIRATION_TIME"]
        >("JWT_EXPIRATION_TIME")
    }

    public async hashPassword(password: string, salt = 12): Promise<string> {
        return await bcrypt.hash(password, salt)
    }

    public async comparePasswords(
        password: string,
        hashedPassword: string,
    ): Promise<boolean> {
        return await bcrypt.compare(password, hashedPassword)
    }

    public async generateToken(payload: JWTPayload): Promise<string> {
        //@ts-expect-error wtf
        return await new SignJWT(payload)
            .setProtectedHeader({ alg: "HS256" })
            .setJti(createId())
            .setIssuedAt()
            .setExpirationTime(this.JWT_EXPIRATION.string)
            .sign(new TextEncoder().encode(this.JWT_SECRET))
    }

    public async decodeToken(token: string): Promise<JWTPayload> {
        return (await jwtVerify(
            token,
            new TextEncoder().encode(this.JWT_SECRET),
        )) as unknown as JWTPayload
    }
}
