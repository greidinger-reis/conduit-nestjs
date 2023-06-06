export const defaultConfig = () => {
    if (!process.env.DATABASE_HOST) throw new Error("DATABASE_HOST is not set")
    if (!process.env.DATABASE_PORT) throw new Error("DATABASE_PORT is not set")
    if (!process.env.DATABASE_USERNAME)
        throw new Error("DATABASE_USERNAME is not set")
    if (!process.env.DATABASE_PASSWORD)
        throw new Error("DATABASE_PASSWORD is not set")
    if (!process.env.DATABASE_NAME) throw new Error("DATABASE_NAME is not set")

    return {
        PORT: parseInt(process.env.PORT ?? "", 10) || 3000,
        DATABASE: {
            type: "postgres" as const,
            host: process.env.DATABASE_HOST,
            port: parseInt(process.env.DATABASE_PORT ?? "", 10) || 5432,
            username: process.env.DATABASE_USERNAME,
            password: process.env.DATABASE_PASSWORD,
            name: process.env.DATABASE_NAME,
        },
        JWT_SECRET: process.env.JWT_SECRET,
        JWT_EXPIRATION_TIME: {
            number: 7200,
            string: "2h",
        },
    }
}

export type Config = ReturnType<typeof defaultConfig>
