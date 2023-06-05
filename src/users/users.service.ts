import { AuthService } from "@/auth/auth.service"
import { Injectable } from "@nestjs/common"
import {
    EmailAlreadyInUseException,
    InvalidCredentialsException,
    UserNameAlreadyExistsException,
} from "./users.exceptions"
import {
    LoginUserDTO,
    RegisterUserDTO,
    UpdateUserDTO,
    UserDTO,
    UserTokenDTO,
} from "./users.model"
import { UsersRepository } from "./users.repository"

@Injectable()
export class UsersService {
    constructor(
        private readonly usersRepository: UsersRepository,
        private readonly authService: AuthService,
    ) {}

    public async getCurrentUser(user: {
        token: string
        id: string
    }): Promise<UserDTO | null> {
        const found = await this.usersRepository.findById(user.id)
        if (!found) return null

        return {
            email: found.email,
            name: found.name,
            bio: found.bio,
            image: found.image,
            token: user.token,
        }
    }

    public async registerUser(user: RegisterUserDTO): Promise<UserDTO> {
        const foundEmail = await this.usersRepository.findByEmail(user.email)
        if (foundEmail) throw new EmailAlreadyInUseException()

        const foundName = await this.usersRepository.findByName(user.name)
        if (foundName) throw new UserNameAlreadyExistsException()

        const hashedPassword = await this.authService.hashPassword(
            user.password,
        )

        user.password = hashedPassword

        const createdUser = await this.usersRepository.create(user)

        const token = await this.authService.generateToken(createdUser.id)

        return {
            email: createdUser.email,
            name: createdUser.name,
            bio: createdUser.bio,
            image: createdUser.image,
            token,
        }
    }

    public async loginUser(user: Omit<LoginUserDTO, "name">): Promise<UserDTO> {
        const found = await this.usersRepository.findByEmail(user.email)

        if (!found) {
            throw new InvalidCredentialsException()
        }

        const isPasswordValid = await this.authService.comparePasswords(
            user.password,
            found.password,
        )

        if (!isPasswordValid) {
            throw new InvalidCredentialsException()
        }

        return {
            email: found.email,
            name: found.name,
            bio: found.bio,
            image: found.image,
            token: await this.authService.generateToken(found.id),
        }
    }

    public async updateUser(
        currentUser: UserTokenDTO,
        user: UpdateUserDTO,
    ): Promise<UserDTO> {
        const found = await this.usersRepository.findById(currentUser.id)

        if (!found) throw new Error("User not found")

        if (user.name) {
            const foundName = await this.usersRepository.findByName(user.name)
            if (foundName) {
                throw new UserNameAlreadyExistsException()
            }
        }

        if (user.email) {
            const foundEmail = await this.usersRepository.findByEmail(
                user.email,
            )
            if (foundEmail) {
                throw new EmailAlreadyInUseException()
            }
        }

        const updatedUser = await this.usersRepository.update(
            currentUser.id,
            user,
        )

        return {
            name: updatedUser.name,
            email: updatedUser.email,
            bio: updatedUser.bio,
            image: updatedUser.image,
            token: currentUser.token,
        }
    }
}
