import { AuthGuard, AuthedRequest } from "@/modules/auth/auth.guard"
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
} from "./exceptions"
import { ILoginUserInput, IRegisterUserInput, IUpdateUserInput } from "./inputs"
import { UserService } from "./user.service"
import { TypedBody, TypedRoute } from "@nestia/core"

@Controller("users")
export class UsersController {
    constructor(private readonly userService: UserService) {}

    @TypedRoute.Post("login")
    public async loginUser(
        @TypedBody()
        body: ILoginUserInput,
    ) {
        try {
            const user = await this.userService.loginUser(body)

            return { user }
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
        body: IRegisterUserInput,
    ) {
        try {
            const user = await this.userService.registerUser(body)

            return { user }
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
    constructor(private readonly usersService: UserService) {}

    @UseGuards(AuthGuard)
    @TypedRoute.Get()
    public async getCurrentUser(@Req() req: AuthedRequest) {
        try {
            const user = await this.usersService.getCurrentUser(req.user)

            //for some unknown reason if I return just {user} it will return an empty object
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

    @UseGuards(AuthGuard)
    @TypedRoute.Put()
    public async updateCurrentUser(
        @Req() req: AuthedRequest,
        @TypedBody()
        body: IUpdateUserInput,
    ) {
        try {
            const user = await this.usersService.updateUser(req.user, body)

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
