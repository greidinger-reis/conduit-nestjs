import { ApiProperty } from "@nestjs/swagger"

export class _CreateCommentDTO {
    @ApiProperty()
    body: string
}

export class CreateCommentDTO {
    @ApiProperty()
    comment: _CreateCommentDTO
}
