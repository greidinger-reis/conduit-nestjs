import { ApiProperty } from "@nestjs/swagger"
import { ProfileDTO } from "../user/user.dto"
import { CommentEntity } from "./comment.entity"

export class CommentDTO {
    @ApiProperty()
    id: string 
    @ApiProperty()
    createdAt: Date
    @ApiProperty()
    updatedAt: Date
    @ApiProperty()
    body: string
    @ApiProperty()
    author: ProfileDTO

    constructor(entity: CommentEntity, currentUser?: string) {
        this.id = entity.id
        this.createdAt = entity.createdAt
        this.updatedAt = entity.updatedAt
        this.body = entity.body
        this.author = new ProfileDTO(entity.author, currentUser)
    }
}
