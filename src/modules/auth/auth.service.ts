import { Injectable } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { compare } from "bcrypt"

export interface JWTPayload {
    sub: string
    iat: number
    exp: number
    jti: string
}

@Injectable()
export class AuthService {
    constructor(private jwtService: JwtService) {}

    public async comparePasswords(
        password: string,
        hashedPassword: string,
    ): Promise<boolean> {
        return await compare(password, hashedPassword)
    }

    public async generateToken(userId: string): Promise<string> {
        return await this.jwtService.signAsync({ sub: userId })
    }

    public async decodeToken(token: string): Promise<JWTPayload> {
        return await this.jwtService.verifyAsync<JWTPayload>(token)
    }
}
