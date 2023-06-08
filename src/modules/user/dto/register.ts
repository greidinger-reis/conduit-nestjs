import { IUserEntity } from "../interfaces/entity" 

export interface RegisterUserDTO {
    user: Pick<IUserEntity, "name" | "email" | "password">
}
