export interface _ICreateArticleInput {
    title: string
    description: string
    body: string
    tagList?: string[]
}

export interface ICreateArticleInput {
    article: _ICreateArticleInput
}
