import { NestFastifyApplication } from "@nestjs/platform-fastify"
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger"

export function setupSwagger(app: NestFastifyApplication) {
    const config = new DocumentBuilder()
        .setTitle("Realworld Nest.js")
        .setDescription("The Realworld Nest.js API description")
        .setVersion("1.0")
        .build()

    const document = SwaggerModule.createDocument(app, config)
    SwaggerModule.setup("api", app, document)
}
