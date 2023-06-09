import { ApiProperty } from "@nestjs/swagger"
import { IUserEntity } from "../interfaces/entity"

export interface IUpdateUserDTO {
    user: Partial<
        Pick<IUserEntity, "name" | "email" | "password" | "image" | "bio">
    >
}

export class _UpdateUserDTO {
    @ApiProperty({ type: "string", required: false })
    name?: string
    @ApiProperty({ type: "string", required: false })
    email?: string
    @ApiProperty({ type: "string", required: false })
    password?: string
    @ApiProperty({ type: "string", nullable: true, required: false })
    image?: string | null
    @ApiProperty({ type: "string", nullable: true, required: false })
    bio?: string | null
}

export class UpdateUserDTO implements IUpdateUserDTO {
    user: _UpdateUserDTO
}
