import { AuthService } from "@/modules/auth/auth.service"
import { Injectable } from "@nestjs/common"
import { AuthedRequestPayload } from "../auth/interfaces/auth-payload"
import { RegisterUserDTO, UpdateUserDTO, LoginUserDTO } from "./dto"
import { ProfileRO, UserRO } from "./dto/response-objects"
import {
    EmailAlreadyInUseException,
    InvalidCredentialsException,
    UserNameAlreadyExistsException,
    UserNotFoundException,
} from "./exceptions"
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
    }): Promise<UserRO | null> {
        const found = await this.userRepository.findById(user.id)
        if (!found) return null

        return new UserRO(found, user.token)
    }

    public async registerUser(input: RegisterUserDTO): Promise<UserRO> {
        const foundEmail = await this.userRepository.findByEmail(
            input.user.email,
        )
        if (foundEmail) throw new EmailAlreadyInUseException()

        const foundName = await this.userRepository.findByName(input.user.name)
        if (foundName) throw new UserNameAlreadyExistsException()

        const user = await this.userRepository.save(new UserEntity(input.user))

        const token = await this.authService.generateToken(user.id)

        return new UserRO(user, token)
    }

    public async loginUser(input: LoginUserDTO): Promise<UserRO> {
        const found = await this.userRepository.findByEmail(input.user.email)

        if (!found) {
            throw new InvalidCredentialsException()
        }

        const isPasswordValid = await this.authService.comparePasswords(
            input.user.password,
            found.password,
        )

        if (!isPasswordValid) {
            throw new InvalidCredentialsException()
        }

        const token = await this.authService.generateToken(found.id)

        return new UserRO(found, token)
    }

    public async updateUser(
        currentUser: AuthedRequestPayload,
        input: UpdateUserDTO,
    ): Promise<UserRO> {
        const user = await this.userRepository.findById(currentUser.id)

        if (!user) throw new Error("User not found")

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

        user.update(input.user)

        await this.userRepository.save(user)

        return new UserRO(user, currentUser.token)
    }

    public async getProfile(
        userName: string,
        currentUser?: AuthedRequestPayload,
    ): Promise<ProfileRO | null> {
        const [found] = await this.userRepository.find({
            where: { name: userName },
            relations: ["followers"],
            take: 1,
        })

        if (!found) return null

        return new ProfileRO(found, currentUser?.id)
    }

    public async followUser(
        userName: string,
        currentUser: AuthedRequestPayload,
    ): Promise<ProfileRO> {
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

        return new ProfileRO(followed, currentUser.id)
    }

    public async unfollowUser(
        userName: string,
        currentUser: AuthedRequestPayload,
    ): Promise<ProfileRO> {
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

        return new ProfileRO(unfollowed, user.id)
    }
}
