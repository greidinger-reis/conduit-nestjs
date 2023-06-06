export class NotArticleAuthorException extends Error {
    constructor() {
        super("You are not the author of this article")
    }
}
