import { IUserEntity } from "../interfaces/entity"

export interface LoginUserDTO {
    user: Pick<IUserEntity, "email" | "password">
}
