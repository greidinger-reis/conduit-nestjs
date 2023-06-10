import { NestFactory } from "@nestjs/core"
import helmet from "@fastify/helmet"
import {
    FastifyAdapter,
    NestFastifyApplication,
} from "@nestjs/platform-fastify"
import fastifyCsrf from "@fastify/csrf-protection"
import { AppModule } from "./app.module"
import { setupSwagger } from "./swagger-setup"

async function bootstrap() {
    const app = await NestFactory.create<NestFastifyApplication>(
        AppModule,
        new FastifyAdapter(),
        { cors: true },
    )

    // @ts-expect-error wtf
    app.register(fastifyCsrf)
    // @ts-expect-error wtf
    app.register(helmet)

    app.setGlobalPrefix("api")

    setupSwagger(app)

    await app.listen(8080, "0.0.0.0")

    console.log(`Listening on ${await app.getUrl()}`)
}
bootstrap()
