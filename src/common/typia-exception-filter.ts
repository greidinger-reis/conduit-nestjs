import {
    ArgumentsHost, Catch, ExceptionFilter, HttpException
} from "@nestjs/common"
import { FastifyReply } from "fastify"

function formatErrorMessage(error: any): string {
    const path = error.path.replace("$input.", "") // Remove '$input.' from the path
    const reason = error.reason.split(": ")[1] // Extract the reason from the error message

    return `Error in ${path}: ${reason}`
}

@Catch(HttpException)
export class TypiaExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        // Catch only bad request errors (typia validation errors)
        if (exception.getStatus() !== 400) throw exception

        const ctx = host.switchToHttp()
        const response = ctx.getResponse<FastifyReply>()
        const status = exception.getStatus()

        response.status(status).send({
            statusCode: status,
            error: formatErrorMessage(exception.getResponse()),
        })
    }
}
