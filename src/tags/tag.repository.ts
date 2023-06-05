import { InsertTag, Tag, tag } from "@/tags/tag.model"
import { DefaultDrizzlePgRepository } from "@/repositories/default-drizzle-pg"
import { DrizzleService } from "@/drizzle/drizzle.service"
import { Injectable } from "@nestjs/common"
import { ITagRepository } from "@/repositories"
import { and, eq } from "drizzle-orm"

@Injectable()
export class TagRepository
    extends DefaultDrizzlePgRepository<typeof tag, Tag, InsertTag>
    implements ITagRepository
{
    constructor(drizzleService: DrizzleService) {
        super(tag, drizzleService)
    }

    async findAllByArticleId(articleId: string) {
        const tags = await this.drizzleService.database
            .select()
            .from(tag)
            .where(eq(tag.articleId, articleId))

        return tags
    }

    async deleteByArticleIdAndName(articleId: string, name: string) {
        void (await this.drizzleService.database
            .delete(tag)
            .where(and(eq(tag.articleId, articleId), eq(tag.name, name))))
    }
}
