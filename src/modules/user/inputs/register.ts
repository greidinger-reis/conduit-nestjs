import { IUserEntity } from "../interfaces/entity" 

export interface IRegisterUserInput {
    user: Pick<IUserEntity, "name" | "email" | "password">
}
