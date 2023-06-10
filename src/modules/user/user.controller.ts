import { TypiaExceptionFilter } from "@/common/typia-exception-filter"
import {
    AuthedRequest,
    AuthGuard,
    OptionalAuthGuard,
} from "@/modules/auth/auth.guard"
import { TypedBody, TypedParam, TypedRoute } from "@nestia/core"
import {
    Controller,
    HttpCode,
    HttpException,
    HttpStatus,
    Req,
    UseFilters,
    UseGuards,
} from "@nestjs/common"
import {
    ApiBadRequestResponse,
    ApiBody,
    ApiConflictResponse,
    ApiCreatedResponse,
    ApiHeader,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    ApiParam,
    ApiTags,
    ApiUnauthorizedResponse,
} from "@nestjs/swagger"
import {
    ILoginUserDTO,
    LoginUserDTO,
    RegisterUserDTO,
    UpdateUserDTO,
} from "./dto"
import { ProfileRO, UserRO } from "./dto/response-objects"
import {
    EmailAlreadyInUseException,
    InvalidCredentialsException,
    UserAlreadyFollowedException,
    UserNameAlreadyInUseException,
    UserNotFollowedException,
    UserNotFoundException,
} from "./exceptions"
import { UserService } from "./user.service"

@Controller("users")
@ApiTags("users")
export class UsersController {
    constructor(private readonly userService: UserService) {}

    @TypedRoute.Post("login")
    @UseFilters(TypiaExceptionFilter)
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: "Login user" })
    @ApiBody({
        type: LoginUserDTO,
        required: true,
        description: "User credentials",
    })
    @ApiOkResponse({ type: UserRO, description: "User response object" })
    @ApiUnauthorizedResponse({ description: "Invalid credentials" })
    @ApiBadRequestResponse({ description: "Validation error (body object)" })
    public async loginUser(
        @TypedBody()
        body: ILoginUserDTO,
    ): Promise<{ user: UserRO }> {
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
    @UseFilters(TypiaExceptionFilter)
    @ApiOperation({ summary: "Register user" })
    @ApiBody({
        type: RegisterUserDTO,
        required: true,
        description: "User credentials",
    })
    @ApiCreatedResponse({ type: UserRO, description: "User response object" })
    @ApiConflictResponse({ description: "Username or email already in use" })
    @ApiBadRequestResponse({ description: "Validation error (body object)" })
    public async registerUser(
        @TypedBody()
        body: RegisterUserDTO,
    ): Promise<{ user: UserRO }> {
        try {
            const user = await this.userService.registerUser(body)

            //I have no idea why I have to return {user:user} instead of just {user}
            return { user: user }
        } catch (error) {
            if (error instanceof UserNameAlreadyInUseException) {
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
@ApiTags("user")
export class UserController {
    constructor(private readonly usersService: UserService) {}

    @TypedRoute.Get()
    @UseGuards(AuthGuard)
    @ApiOperation({ summary: "Get current user" })
    @ApiHeader({
        name: "Authorization",
        description: "JWT token",
        required: true,
        example: "Token <token>",
    })
    @ApiOkResponse({ type: UserRO, description: "User response object" })
    @ApiUnauthorizedResponse({ description: "User not authenticated" })
    public async getCurrentUser(@Req() req: AuthedRequest) {
        const user = await this.usersService.getCurrentUser(req.user)

        //for some unknown reason if I return just {user} it will return an empty object
        return { user: user }
    }

    @TypedRoute.Put()
    @UseGuards(AuthGuard)
    @ApiOperation({ summary: "Update current user" })
    @ApiHeader({
        name: "Authorization",
        description: "JWT token",
        required: true,
        example: "Token <token>",
    })
    @ApiBody({
        type: UpdateUserDTO,
        required: true,
        description: "User credentials",
    })
    @ApiOkResponse({ type: UserRO, description: "User response object" })
    @ApiUnauthorizedResponse({ description: "User not authenticated" })
    @ApiBadRequestResponse({ description: "Validation error (body object)" })
    @ApiConflictResponse({
        description: "Username or email already in use",
    })
    public async updateCurrentUser(
        @Req() req: AuthedRequest,
        @TypedBody()
        body: UpdateUserDTO,
    ) {
        try {
            const user = await this.usersService.updateUser(req.user, body)
            return { user: user }
        } catch (error) {
            if(error instanceof UserNameAlreadyInUseException){
                throw new HttpException(
                    {
                        status: HttpStatus.CONFLICT,
                        error: error.message,
                    },
                    HttpStatus.CONFLICT,
                )
            }
            if(error instanceof EmailAlreadyInUseException){
                throw new HttpException(
                    {
                        status: HttpStatus.CONFLICT,
                        error: error.message,
                    },
                    HttpStatus.CONFLICT,
                )
            }
            if(error instanceof UserNotFoundException){
                throw new HttpException(
                    {
                        status: HttpStatus.NOT_FOUND,
                        error: error.message,
                    },
                    HttpStatus.NOT_FOUND,
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

@Controller("profiles")
@ApiTags("profiles")
export class ProfileController {
    constructor(private readonly usersService: UserService) {}

    @TypedRoute.Get(":username")
    @UseGuards(OptionalAuthGuard)
    @ApiOperation({ summary: "Get profile" })
    @ApiHeader({
        name: "Authorization",
        description: "JWT token",
        example: "Token <token>",
    })
    @ApiOkResponse({
        type: ProfileRO,
        schema: { nullable: true, type: "object" },
        description: "User response object",
    })
    @ApiParam({
        name: "username",
        required: true,
    })
    public async getProfile(
        @TypedParam("username") username: string,
        @Req() req: AuthedRequest,
    ): Promise<{ profile: ProfileRO | null }> {
        const user = await this.usersService.getProfile(username, req.user)

        return { profile: user }
    }

    @TypedRoute.Post(":username/follow")
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard)
    @ApiOperation({ summary: "Follow user" })
    @ApiHeader({
        name: "Authorization",
        description: "JWT token",
        required: true,
        example: "Token <token>",
    })
    @ApiParam({
        name: "username",
        required: true,
    })
    @ApiOkResponse({ description: "User response object" })
    @ApiBadRequestResponse({ description: "Validation error (param)" })
    @ApiUnauthorizedResponse({ description: "User not authenticated" })
    @ApiNotFoundResponse({ description: "User to follow not found" })
    @ApiConflictResponse({ description: "User already followed" })
    public async followUser(
        @TypedParam("username") username: string,
        @Req() req: AuthedRequest,
    ) {
        try {
            const user = await this.usersService.followUser(username, req.user)

            return { profile: user }
        } catch (error) {
            if (error instanceof UserAlreadyFollowedException) {
                throw new HttpException(
                    {
                        status: HttpStatus.CONFLICT,
                        error: error.message,
                    },
                    HttpStatus.CONFLICT,
                )
            }

            if (error instanceof UserNotFoundException) {
                throw new HttpException(
                    {
                        status: HttpStatus.NOT_FOUND,
                        error: (error as Error).message,
                    },
                    HttpStatus.NOT_FOUND,
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

    @TypedRoute.Delete(":username/follow")
    @UseGuards(AuthGuard)
    @ApiOperation({ summary: "Unfollow user" })
    @ApiHeader({
        name: "Authorization",
        description: "JWT token",
        required: true,
        example: "Token <token>",
    })
    @ApiParam({
        name: "username",
        required: true,
    })
    @ApiOkResponse({ description: "User response object" })
    @ApiBadRequestResponse({ description: "Validation error (param)" })
    @ApiUnauthorizedResponse({ description: "User not authenticated" })
    @ApiNotFoundResponse({ description: "User to unfollow not found" })
    @ApiConflictResponse({ description: "User not followed" })
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
            if (error instanceof UserNotFollowedException) {
                throw new HttpException(
                    {
                        status: HttpStatus.CONFLICT,
                        error: error.message,
                    },
                    HttpStatus.CONFLICT,
                )
            }
            if (error instanceof UserNotFoundException) {
                throw new HttpException(
                    {
                        status: HttpStatus.NOT_FOUND,
                        error: (error as Error).message,
                    },
                    HttpStatus.NOT_FOUND,
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
