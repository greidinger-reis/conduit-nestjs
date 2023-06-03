import { AuthGuard, AuthedRequest } from "@/auth/auth.guard"
import {
    Body,
    Controller,
    Get,
    HttpException,
    HttpStatus,
    Post,
    Put,
    Req,
    UseGuards,
} from "@nestjs/common"
import {
    EmailAlreadyInUseException,
    InvalidCredentialsException,
    UserNameAlreadyExistsException,
} from "./users.exceptions"
import { CreateUserDTO, UpdateUserDTO } from "./users.model"
import { UsersService } from "./users.service"

@Controller("users")
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post("login")
    public async loginUser(
        @Body()
        body: {
            user: Omit<CreateUserDTO, "name">
        },
    ) {
        try {
            const user = await this.usersService.loginUser(body.user)
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

    @Post()
    public async registerUser(
        @Body()
        body: {
            user: CreateUserDTO
        },
    ) {
        try {
            const user = await this.usersService.registerUser(body.user)
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
    constructor(private readonly usersService: UsersService) {}

    @UseGuards(AuthGuard)
    @Get()
    public async getCurrentUser(@Req() req: AuthedRequest) {
        try {
            const user = await this.usersService.getCurrentUser(req.token)

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
    @Put()
    public async updateCurrentUser(
        @Req() req: AuthedRequest,
        @Body()
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
