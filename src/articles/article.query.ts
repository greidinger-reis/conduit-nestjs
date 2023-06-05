export interface IArticleQuery {
    /**
     * @type int
     */
    limit?: number
    /**
     * @type int
     */
    offset?: number

    author?: string

    favorited?: string

    tag?: string
}
