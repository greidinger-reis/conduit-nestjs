import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from "@nestjs/common"
import { AuthService } from "./auth.service"
import { Request } from "express"

export type AuthedRequest = Request & { token: string }
export type OptionalAuthedRequest = Request & { token?: string }

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private readonly authService: AuthService) {}

    async canActivate(ctx: ExecutionContext): Promise<boolean> {
        const req = ctx.switchToHttp().getRequest<AuthedRequest>()
        const token = this.extractFromHeader(req)
        if (!token) throw new UnauthorizedException()

        void (await this.authService.decodeToken(token).catch(() => {
            throw new UnauthorizedException()
        }))

        req.token = token

        return true
    }

    private extractFromHeader(req: Request): string | null {
        const [type, token] = req.headers.authorization?.split(" ") ?? []
        return type === "Token" ? token : null
    }
}

@Injectable()
export class OptionalAuthGuard implements CanActivate {
    async canActivate(ctx: ExecutionContext): Promise<boolean> {
        const req = ctx.switchToHttp().getRequest<AuthedRequest>()
        const token = this.extractFromHeader(req)
        if (!token) return true

        req.token = token

        return true
    }

    private extractFromHeader(req: Request): string | null {
        const [type, token] = req.headers.authorization?.split(" ") ?? []
        return type === "Token" ? token : null
    }
}
