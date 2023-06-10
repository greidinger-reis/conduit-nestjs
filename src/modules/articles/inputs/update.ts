import { ApiProperty } from "@nestjs/swagger"
import { CreateArticleDTO, _CreateArticleDTO } from "./create"

export class UpdateArticleDTO {
    @ApiProperty()
    article: Partial<_CreateArticleDTO>
}
