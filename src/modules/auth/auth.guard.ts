import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from "@nestjs/common"
import { AuthService } from "./auth.service"
import { FastifyRequest } from "fastify"
import { AuthedRequestPayload } from "./interfaces/auth-payload"

export type AuthedRequest = FastifyRequest & { user: AuthedRequestPayload }
export type OptionalAuthedRequest = FastifyRequest & {
    user?: AuthedRequestPayload
}

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private readonly authService: AuthService) {}

    async canActivate(ctx: ExecutionContext): Promise<boolean> {
        const req = ctx.switchToHttp().getRequest<AuthedRequest>()
        const token = this.extractFromHeader(req)
        if (!token) throw new UnauthorizedException()

        const { sub } = await this.authService.decodeToken(token).catch(() => {
            throw new UnauthorizedException()
        })

        req.user = { id: sub, token }

        return true
    }

    private extractFromHeader(req: FastifyRequest): string | null {
        const [type, token] = req.headers.authorization?.split(" ") ?? []
        return type === "Token" ? token : null
    }
}

@Injectable()
export class OptionalAuthGuard implements CanActivate {
    constructor(private readonly authService: AuthService) {}

    async canActivate(ctx: ExecutionContext): Promise<boolean> {
        const req = ctx.switchToHttp().getRequest<AuthedRequest>()
        const token = this.extractFromHeader(req)

        if (!token) return true

        try {
            const { sub } = await this.authService.decodeToken(token)
            req.user = { id: sub, token }
        } finally {
            return true
        }
    }

    private extractFromHeader(req: FastifyRequest): string | null {
        const [type, token] = req.headers.authorization?.split(" ") ?? []
        return type === "Token" ? token : null
    }
}
