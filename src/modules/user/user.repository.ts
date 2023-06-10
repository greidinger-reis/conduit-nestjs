import { Injectable } from "@nestjs/common"
import { DataSource, Repository } from "typeorm"
import { AuthedRequestPayload } from "../auth/interfaces/auth-payload"
import {
    UserAlreadyFollowedException,
    UserNotFollowedException,
    UserNotFoundException,
} from "./exceptions"
import { IUserRepository } from "./interfaces/repository"
import { UserEntity } from "./user.entity"

@Injectable()
export class UserRepository
    extends Repository<UserEntity>
    implements IUserRepository
{
    constructor(private readonly dataSource: DataSource) {
        super(UserEntity, dataSource.createEntityManager())
    }

    async findByEmail(email: string): Promise<UserEntity | null> {
        return this.findOne({ where: { email } })
    }

    async findByName(name: string): Promise<UserEntity | null> {
        return this.findOne({ where: { name } })
    }

    async findById(id: string): Promise<UserEntity | null> {
        return this.findOne({ where: { id } })
    }

    public async followUser(
        userToFollow: UserEntity,
        user: UserEntity,
    ): Promise<UserEntity> {
        if (user.following.some((e) => e.id === userToFollow.id)) {
            throw new UserAlreadyFollowedException()
        }

        if (userToFollow.followers) {
            userToFollow.followers.push(user)
            user.following.push(userToFollow)
        } else {
            userToFollow.followers = [user]
            user.following = [userToFollow]
        }

        await this.save(userToFollow)
        await this.save(user)
        return userToFollow
    }

    public async unfollowUser(
        userToUnfollow: UserEntity,
        user: UserEntity,
    ): Promise<UserEntity> {
        if (!user.following.some((e) => e.id === userToUnfollow.id)) {
            throw new UserNotFollowedException()
        }

        userToUnfollow.followers = userToUnfollow.followers.filter(
            (_user) => _user.id !== user.id,
        )
        user.following = user.following.filter(
            (_user) => _user.id !== userToUnfollow.id,
        )

        await this.save(userToUnfollow)
        await this.save(user)
        return userToUnfollow
    }
}
