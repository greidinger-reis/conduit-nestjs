import { IUserEntity } from "../interfaces/entity" 

export interface ILoginUserInput {
    user: Pick<IUserEntity, "email" | "password">
}
