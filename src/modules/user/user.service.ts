import { AuthService } from "@/modules/auth/auth.service"
import { Injectable } from "@nestjs/common"
import { AuthedRequestPayload } from "../auth/interfaces/auth-payload"
import {
    EmailAlreadyInUseException,
    InvalidCredentialsException,
    UserNameAlreadyExistsException,
    UserNotFollowedException,
    UserNotFoundException,
} from "./exceptions"
import { ILoginUserInput } from "./inputs/login"
import { IRegisterUserInput } from "./inputs/register"
import { IUpdateUserInput } from "./inputs/update"
import { ProfileDTO, UserDTO } from "./user.dto"
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

    public async getProfile(
        userName: string,
        currentUser?: AuthedRequestPayload,
    ): Promise<ProfileDTO | null> {
        const [found] = await this.userRepository.find({
            where: { name: userName },
            relations: ["followers"],
            take: 1,
        })

        if (!found) return null

        return new ProfileDTO(found, currentUser?.id)
    }

    public async followUser(
        userName: string,
        currentUser: AuthedRequestPayload,
    ): Promise<ProfileDTO> {
        const [user] = await this.userRepository.find({
            where: { id: currentUser.id },
            relations: ["following"],
            take: 1,
        })

        if (!user) throw new UserNotFoundException()

        const [userToFollow] = await this.userRepository.find({
            where: { name: userName },
            relations: ["followers"],
            take: 1,
        })

        if (!userToFollow) throw new UserNotFoundException()

        const followed = await this.userRepository.followUser(
            userToFollow,
            user,
        )

        return new ProfileDTO(followed, currentUser.id)
    }

    public async unfollowUser(
        userName: string,
        currentUser: AuthedRequestPayload,
    ): Promise<ProfileDTO> {
        const [user] = await this.userRepository.find({
            where: { id: currentUser.id },
            relations: ["following"],
            take: 1,
        })
        if (!user) {
            throw new UserNotFoundException()
        }

        const [userToUnfollow] = await this.userRepository.find({
            where: { name: userName },
            relations: ["followers"],
            take: 1,
        })
        if (!userToUnfollow) throw new UserNotFoundException()

        const unfollowed = await this.userRepository.unfollowUser(
            userToUnfollow,
            user,
        )

        return new ProfileDTO(unfollowed, user.id)
    }
}
