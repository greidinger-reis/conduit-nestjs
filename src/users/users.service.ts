import { AuthService } from "@/auth/auth.service"
import { UsersRepository } from "./users.repository"
import { InsertUser, User } from "./users.model"
import { Injectable } from "@nestjs/common"

@Injectable()
export class UsersService {
    constructor(
        private readonly usersRepository: UsersRepository,
        private readonly authService: AuthService,
    ) {}

    public async getCurrentUser(token: string): Promise<User | null> {
        const payload = await this.authService.decodeToken(token)
        const id = payload.sub
        return this.usersRepository.findById(id)
    }

    public async registerUser(user: Omit<InsertUser, "id">): Promise<User> {
        const hashedPassword = await this.authService.hashPassword(
            user.password,
        )

        user.password = hashedPassword

        return await this.usersRepository.create(user)
    }

    public async loginUser(user: Omit<InsertUser, "id" | "name">): Promise<User> {
        const foundUser = await this.usersRepository.findByEmail(user.email)

        if (!foundUser) {
            throw new Error("User not found")
        }

        const isPasswordValid = await this.authService.comparePasswords(
            user.password,
            foundUser.password,
        )

        if (!isPasswordValid) {
            throw new Error("Invalid password")
        }

        return foundUser
    }
}
