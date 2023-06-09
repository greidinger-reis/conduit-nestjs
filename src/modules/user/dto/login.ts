import { ApiProperty } from "@nestjs/swagger"
import { IUserEntity } from "../interfaces/entity"

export interface ILoginUserDTO {
    user: Pick<IUserEntity, "email" | "password">
}

export class _LoginUserDTO {
    @ApiProperty() email: string
    @ApiProperty() password: string
}

export class LoginUserDTO implements ILoginUserDTO {
    @ApiProperty()
    user: _LoginUserDTO
}

