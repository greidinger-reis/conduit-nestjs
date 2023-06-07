import {
    AuthGuard,
    AuthedRequest,
    OptionalAuthGuard,
} from "@/modules/auth/auth.guard"
import {
    Controller,
    HttpException,
    HttpStatus,
    Req,
    Res,
    UseGuards,
} from "@nestjs/common"
import {
    EmailAlreadyInUseException,
    InvalidCredentialsException,
    UserNameAlreadyExistsException,
} from "./exceptions"
import { ILoginUserInput, IRegisterUserInput, IUpdateUserInput } from "./inputs"
import { UserService } from "./user.service"
import { TypedBody, TypedParam, TypedRoute } from "@nestia/core"

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

            //I have no idea why I have to return {user:user} instead of just {user}
            return { user: user }
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

            //I have no idea why I have to return {user:user} instead of just {user}
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
    constructor(private readonly usersService: UserService) {}

    @UseGuards(AuthGuard)
    @TypedRoute.Get()
    public async getCurrentUser(@Req() req: AuthedRequest) {
        try {
            const user = await this.usersService.getCurrentUser(req.user)

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
        body: IUpdateUserInput,
    ) {
        try {
            const user = await this.usersService.updateUser(req.user, body)

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
}

@Controller("profiles")
export class ProfileController {
    constructor(private readonly usersService: UserService) {}

    @UseGuards(OptionalAuthGuard)
    @TypedRoute.Get(":username")
    public async getProfile(
        @TypedParam("username") username: string,
        @Req() req: AuthedRequest,
    ) {
        try {
            const user = await this.usersService.getProfile(username, req.user)

            return { profile: user }
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
    @TypedRoute.Post(":username/follow")
    public async followUser(
        @TypedParam("username") username: string,
        @Req() req: AuthedRequest,
    ) {
        try {
            const user = await this.usersService.followUser(username, req.user)

            return { profile: user }
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
    @TypedRoute.Delete(":username/follow")
    public async unfollowUser(
        @TypedParam("username") username: string,
        @Req() req: AuthedRequest,
    ) {
        try {
            const user = await this.usersService.unfollowUser(
                username,
                req.user,
            )

            return { profile: user }
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
