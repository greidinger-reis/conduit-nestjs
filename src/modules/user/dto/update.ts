import { IUserEntity } from "../interfaces/entity"

export interface UpdateUserDTO {
    user: Partial<
        Pick<IUserEntity, "name" | "email" | "password" | "image" | "bio">
    >
}
