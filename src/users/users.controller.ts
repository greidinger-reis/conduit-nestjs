import { Body, Controller, Get, Post, Req } from "@nestjs/common"
import { UsersService } from "./users.service"
import { Request } from "express"
import { errors } from "jose"
import { InsertUser } from "./users.model"

@Controller("users")
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post()
    public async registerUser(
        @Body()
        body: Omit<InsertUser, "id" | "bio" | "image" | "emailVerified">,
    ) {
        try {
            return await this.usersService.registerUser(body)
        } catch (error) {
            console.dir(error)
            return (error as Error).message
        }
    }
}

@Controller("user")
export class UserController {
    constructor(private readonly usersService: UsersService) {}

    @Get()
    public async getCurrentUser(@Req() req: Request) {
        const token = req.headers.authorization?.split(" ")[1]
        if (!token) throw new Error("No token provided")
        try {
            return await this.usersService.getCurrentUser(token)
        } catch (error) {
            if (error instanceof errors.JWTExpired) {
                return "Expired token"
            } else if (error instanceof errors.JWSSignatureVerificationFailed) {
                return "Invalid token"
            } else {
                throw error
            }
        }
    }
}
