import { ApiProperty } from "@nestjs/swagger"
import { ProfileRO } from "../user/dto/response-objects"
import { CommentEntity } from "./comment.entity"

export class CommentRO {
    @ApiProperty()
    id: string 
    @ApiProperty()
    createdAt: Date
    @ApiProperty()
    updatedAt: Date
    @ApiProperty()
    body: string
    @ApiProperty()
    author: ProfileRO 

    constructor(entity: CommentEntity, currentUser?: string) {
        this.id = entity.id
        this.createdAt = entity.createdAt
        this.updatedAt = entity.updatedAt
        this.body = entity.body
        this.author = new ProfileRO(entity.author, currentUser)
    }
}
