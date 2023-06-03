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
