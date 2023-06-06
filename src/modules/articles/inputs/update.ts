import { _ICreateArticleInput } from "./create"

export interface IUpdateArticleInput {
    article: Partial<_ICreateArticleInput>
}
