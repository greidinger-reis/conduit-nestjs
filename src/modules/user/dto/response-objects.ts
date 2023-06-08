import { ApiProperty } from "@nestjs/swagger"
import { UserEntity } from "../user.entity"

export class UserRO {
    @ApiProperty()
    email: string

    @ApiProperty()
    token: string

    @ApiProperty()
    name: string

    @ApiProperty()
    bio: string | null

    @ApiProperty()
    image: string | null

    constructor(entity: UserEntity, token: string) {
        Object.assign(this, entity)
        this.token = token
    }
}

export class ProfileRO {
    @ApiProperty()
    username: string

    @ApiProperty()
    bio: string | null

    @ApiProperty()
    image: string | null

    @ApiProperty()
    following: boolean

    constructor(entity: UserEntity, currentUserId?: string) {
        Object.assign(this, entity)
    }
}
