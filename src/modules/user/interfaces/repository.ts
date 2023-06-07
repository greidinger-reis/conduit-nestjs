import { AuthedRequestPayload } from "@/modules/auth/interfaces/auth-payload"
import { IUserEntity } from "./entity"

export interface IUserRepository {
    findByEmail(email: string): Promise<IUserEntity | null>
    findByName(name: string): Promise<IUserEntity | null>
    findById(id: string): Promise<IUserEntity | null>
    followUser(
        user: AuthedRequestPayload,
        userToFollow: IUserEntity,
    ): Promise<IUserEntity>
    unfollowUser(
        user: AuthedRequestPayload,
        userToUnfollow: IUserEntity,
    ): Promise<IUserEntity>
}
