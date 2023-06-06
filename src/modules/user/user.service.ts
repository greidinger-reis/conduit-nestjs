import { AuthService } from "@/modules/auth/auth.service"
import { Injectable } from "@nestjs/common"
import { AuthedRequestPayload } from "../auth/interfaces/auth-payload"
import {
    EmailAlreadyInUseException,
    InvalidCredentialsException,
    UserNameAlreadyExistsException,
} from "./exceptions"
import { ILoginUserInput } from "./inputs/login"
import { IRegisterUserInput } from "./inputs/register"
import { IUpdateUserInput } from "./inputs/update"
import { UserDTO } from "./user.dto"
import { UserEntity } from "./user.entity"
import { UserRepository } from "./user.repository"

@Injectable()
export class UserService {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly authService: AuthService,
    ) {}

    public async getCurrentUser(user: {
        token: string
        id: string
    }): Promise<UserDTO | null> {
        const found = await this.userRepository.findById(user.id)
        if (!found) return null

        return new UserDTO(found, user.token)
    }

    public async registerUser({ user }: IRegisterUserInput): Promise<UserDTO> {
        const foundEmail = await this.userRepository.findByEmail(user.email)
        if (foundEmail) throw new EmailAlreadyInUseException()

        const foundName = await this.userRepository.findByName(user.name)
        if (foundName) throw new UserNameAlreadyExistsException()

        const hashedPassword = await this.authService.hashPassword(
            user.password,
        )

        const createdUser = await this.userRepository.save(
            new UserEntity()
                .setName(user.name)
                .setEmail(user.email)
                .setPassword(hashedPassword),
        )

        const token = await this.authService.generateToken(createdUser.id)

        return new UserDTO(createdUser, token)
    }

    public async loginUser({ user }: ILoginUserInput): Promise<UserDTO> {
        const found = await this.userRepository.findByEmail(user.email)

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

        const token = await this.authService.generateToken(found.id)

        return new UserDTO(found, token)
    }

    public async updateUser(
        currentUser: AuthedRequestPayload,
        { user }: IUpdateUserInput,
    ): Promise<UserDTO> {
        const userToUpdate = await this.userRepository.findById(currentUser.id)

        if (!userToUpdate) throw new Error("User not found")

        if (user.name) {
            const foundName = await this.userRepository.findByName(user.name)
            if (foundName) {
                throw new UserNameAlreadyExistsException()
            }
        }

        if (user.email) {
            const foundEmail = await this.userRepository.findByEmail(user.email)
            if (foundEmail) {
                throw new EmailAlreadyInUseException()
            }
        }

        userToUpdate
            .setName(user.name)
            .setEmail(user.email)
            .setBio(user.bio)
            .setPassword(
                user.password
                    ? await this.authService.hashPassword(user.password)
                    : undefined,
            )
            .setImage(user.image)

        await this.userRepository.update({ id: userToUpdate.id }, userToUpdate)

        return new UserDTO(userToUpdate, currentUser.token)
    }
}
