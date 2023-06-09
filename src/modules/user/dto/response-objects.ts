import { ApiProperty } from "@nestjs/swagger"
import { UserEntity } from "../user.entity"

export class UserRO {
    @ApiProperty()
    email: string

    @ApiProperty()
    token: string

    @ApiProperty()
    name: string

    @ApiProperty({ type: "string", nullable: true })
    bio: string | null

    @ApiProperty({ type: "string", nullable: true })
    image: string | null

    constructor(entity: UserEntity, token: string) {
        Object.assign(this, entity)
        this.token = token
    }
}

export class ProfileRO {
    @ApiProperty()
    username: string

    @ApiProperty({ type: "string", nullable: true })
    bio: string | null

    @ApiProperty({ type: "string", nullable: true })
    image: string | null

    @ApiProperty()
    following: boolean

    constructor(entity: UserEntity, currentUserId?: string) {
        Object.assign(this, entity)
        this.following = currentUserId
            ? entity.followers.some((follower) => follower.id === currentUserId)
            : false
    }
}
