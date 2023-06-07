import { NestFactory } from "@nestjs/core"
import helmet from "@fastify/helmet"
import {
    FastifyAdapter,
    NestFastifyApplication,
} from "@nestjs/platform-fastify"
import fastifyCsrf from "@fastify/csrf-protection"
import { AppModule } from "./app.module"

async function bootstrap() {
    const app = await NestFactory.create<NestFastifyApplication>(
        AppModule,
        new FastifyAdapter(),
        { cors: true }
    )

    app.register(fastifyCsrf)
    app.register(helmet)

    app.setGlobalPrefix("api")

    await app.listen(8080, "0.0.0.0")
    console.log(`Listening on ${await app.getUrl()}`)
}
bootstrap()
