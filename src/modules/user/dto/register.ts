import { ApiProperty } from "@nestjs/swagger"
import { IUserEntity } from "../interfaces/entity"

export interface IRegisterUserDTO {
    user: Pick<IUserEntity, "name" | "email" | "password">
}

export class _RegisterUserDTO {
    @ApiProperty() name: string
    @ApiProperty() email: string
    @ApiProperty() password: string
}

export class RegisterUserDTO implements IRegisterUserDTO {
    @ApiProperty()
    user: _RegisterUserDTO
}
