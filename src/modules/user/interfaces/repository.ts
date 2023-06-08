import { IUserEntity } from "./entity"

export interface IUserRepository {
    findByEmail(email: string): Promise<IUserEntity | null>
    findByName(name: string): Promise<IUserEntity | null>
    findById(id: string): Promise<IUserEntity | null>
    followUser(
        user: IUserEntity,
        userToFollow: IUserEntity,
    ): Promise<IUserEntity>
    unfollowUser(
        user: IUserEntity,
        userToUnfollow: IUserEntity,
    ): Promise<IUserEntity>
}
