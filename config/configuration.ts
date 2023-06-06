export const defaultConfig = () => {
    if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not set")
    if(!process.env.JWT_SECRET) throw new Error("JWT_SECRET is not set")
    

    return {
        PORT: parseInt(process.env.PORT ?? "", 10) || 3000,
        DATABASE_URL: process.env.DATABASE_URL,
        JWT_SECRET: process.env.JWT_SECRET,
        JWT_EXPIRATION_TIME: {
            number: 7200,
            string: "2h",
        },
    }
}

export type Config = ReturnType<typeof defaultConfig>
