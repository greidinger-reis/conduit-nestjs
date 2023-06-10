export class NotArticleAuthorException extends Error {
    constructor() {
        super("You are not the author of this article")
    }
}

export class ArticleNotFoundException extends Error {
    constructor() {
        super("Article not found")
    }
}

export class UserAlreadyFavoritedArticleException extends Error {
    constructor() {
        super("User already favorited this article")
    }
}

export class UserHasntFavoritedArticleException extends Error {
    constructor() {
        super("User hasn't favorited this article")
    }
}
