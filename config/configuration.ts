export const defaultConfig = () => ({
    PORT: parseInt(process.env.PORT ?? "", 10) || 3000,
    DATABASE_URL: process.env.DATABASE_URL,
    DB_LOGGING: process.env.DB_LOGGING === "true",
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRATION_TIME: {
        number: 7200,
        string: "2h",
    },
})

export type Config = ReturnType<typeof defaultConfig>
