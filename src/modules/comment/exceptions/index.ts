export class CommentNotFoundException extends Error {
    constructor() {
        super("Comment not found")
    }
}

export class NotCommentAuthorException extends Error {
    constructor() {
        super("Not comment author")
    }
}
