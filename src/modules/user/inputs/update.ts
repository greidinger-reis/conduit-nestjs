import { IUserEntity } from "../interfaces/entity"

export interface IUpdateUserInput {
    user: Partial<
        Pick<IUserEntity, "name" | "email" | "password" | "image" | "bio">
    >
}
