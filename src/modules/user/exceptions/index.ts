export class UserNameAlreadyExistsException extends Error {
    constructor() {
        super("Username already in use")
    }
}

export class EmailAlreadyInUseException extends Error {
    constructor() {
        super("Email already in use")
    }
}

export class InvalidCredentialsException extends Error {
    constructor() {
        super("Invalid credentials")
    }
}

export class UserNotFoundException extends Error {
    constructor() {
        super("User not found")
    }
}

export class UserAlreadyFollowedException extends Error {
    constructor() {
        super("User already followed")
    }
}

export class UserNotFollowedException extends Error {
    constructor() {
        super("User not followed")
    }
}
