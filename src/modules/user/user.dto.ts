import { ApiProperty } from "@nestjs/swagger"
import { UserEntity } from "./user.entity"

export class UserDTO {
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
        this.email = entity.email
        this.name = entity.name
        this.bio = entity.bio
        this.image = entity.image
        this.token = token
    }
}

export class ProfileDTO {
    @ApiProperty()
    username: string

    @ApiProperty()
    bio: string | null

    @ApiProperty()
    image: string | null

    @ApiProperty()
    following: boolean

    constructor(entity: UserEntity, currentUserId?: string) {
        this.username = entity.name
        this.bio = entity.bio
        this.image = entity.image
        this.following = entity.followers
            ? entity.followers.some((follower) => follower.id === currentUserId)
            : false
    }
}
