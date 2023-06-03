import { Article, InsertArticle, article } from "@/models/article"
import {DefaultDrizzlePgRepository} from "./default-drizzle-pg"
import { DrizzleService } from "@/drizzle/drizzle.service"

export class ArticleRepository extends DefaultDrizzlePgRepository<
    typeof article,
    Article,
    InsertArticle
> {
    constructor(drizzleService: DrizzleService) {
        super(article, drizzleService)
    }
}
