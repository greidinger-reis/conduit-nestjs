import { ApiProperty } from "@nestjs/swagger"

export class _CreateArticleDTO {
    @ApiProperty()
    title: string
    @ApiProperty()
    description: string
    @ApiProperty()
    body: string
    @ApiProperty({ type: [String], required: false })
    tagList?: string[]
}

export class CreateArticleDTO {
    @ApiProperty()
    article: _CreateArticleDTO

    constructor(dto: _CreateArticleDTO) {
        Object.assign(this.article, dto)
    }
}
