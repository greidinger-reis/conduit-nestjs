import { AuthGuard, AuthedRequest } from "@/auth/auth.guard"
import {
    Controller,
    HttpException,
    HttpStatus,
    Req,
    UseGuards,
} from "@nestjs/common"
import {
    EmailAlreadyInUseException,
    InvalidCredentialsException,
    UserNameAlreadyExistsException,
} from "./users.exceptions"
import { RegisterUserDTO, LoginUserDTO, UpdateUserDTO } from "./users.model"
import { UsersService } from "./users.service"
import { TypedBody, TypedRoute } from "@nestia/core"

@Controller("users")
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @TypedRoute.Post("login")
    public async loginUser(
        @TypedBody()
        body: {
            user: LoginUserDTO
        },
    ) {
        try {
            const user = await this.usersService.loginUser(body.user)

            //for some unknown reason if I return just {user} it will return an empty object
            return { user:user }
        } catch (error) {
            if (error instanceof InvalidCredentialsException) {
                throw new HttpException(
                    {
                        status: HttpStatus.UNAUTHORIZED,
                        error: error.message,
                    },
                    HttpStatus.UNAUTHORIZED,
                )
            }

            throw new HttpException(
                {
                    status: HttpStatus.INTERNAL_SERVER_ERROR,
                    error: (error as Error).message,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            )
        }
    }

    @TypedRoute.Post()
    public async registerUser(
        @TypedBody()
        body: {
            user: RegisterUserDTO
        },
    ) {
        try {
            const user = await this.usersService.registerUser(body.user)

            //for some unknown reason if I return just {user} it will return an empty object
            return { user: user }
        } catch (error) {
            if (error instanceof UserNameAlreadyExistsException) {
                throw new HttpException(
                    {
                        status: HttpStatus.CONFLICT,
                        error: error.message,
                    },
                    HttpStatus.CONFLICT,
                )
            }
            if (error instanceof EmailAlreadyInUseException) {
                throw new HttpException(
                    {
                        status: HttpStatus.CONFLICT,
                        error: error.message,
                    },
                    HttpStatus.CONFLICT,
                )
            }

            throw new HttpException(
                {
                    status: HttpStatus.INTERNAL_SERVER_ERROR,
                    error: (error as Error).message,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            )
        }
    }
}

@Controller("user")
export class UserController {
    constructor(private readonly usersService: UsersService) {}

    @UseGuards(AuthGuard)
    @TypedRoute.Get()
    public async getCurrentUser(@Req() req: AuthedRequest) {
        try {
            const user = await this.usersService.getCurrentUser(req.token)

            //for some unknown reason if I return just {user} it will return an empty object
            return { user: user }
        } catch (error) {
            throw new HttpException(
                {
                    status: HttpStatus.NOT_FOUND,
                    error: (error as Error).message,
                },
                HttpStatus.NOT_FOUND,
            )
        }
    }

    @UseGuards(AuthGuard)
    @TypedRoute.Put()
    public async updateCurrentUser(
        @Req() req: AuthedRequest,
        @TypedBody()
        body: {
            user: UpdateUserDTO
        },
    ) {
        try {
            const user = await this.usersService.updateUser(
                req.token,
                body.user,
            )

            return { user }
        } catch (error) {
            throw new HttpException(
                {
                    status: HttpStatus.NOT_FOUND,
                    error: (error as Error).message,
                },
                HttpStatus.NOT_FOUND,
            )
        }
    }
}
