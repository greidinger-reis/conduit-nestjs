import { InferModel } from "drizzle-orm"
import { pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core"

export const user = pgTable("user", {
    id: varchar("id", { length: 256 }).notNull().primaryKey(),
    name: varchar("name", { length: 256 }).notNull(),
    password: varchar("password", { length: 256 }).notNull(),
    email: varchar("email", { length: 256 }).notNull(),
    emailVerified: timestamp("emailVerified"),
    bio: text("bio"),
    image: varchar("image", { length: 256 }),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
})

export type User = InferModel<typeof user>
export type InsertUser = InferModel<typeof user, "insert">

export interface RegisterUserDTO {
    /**
     * @pattern ^[a-zA-Z0-9]+$
     * @minLength 3
     * @maxLength 16
     * */
    name: InsertUser["name"]

    /**
     * @format email
     */
    email: InsertUser["email"]

    /**
     * @pattern ^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+{};:,<.>]).+$
     * @minLength 8
     */
    password: InsertUser["password"]
}

export interface LoginUserDTO extends Pick<InsertUser, "email" | "password"> {}

export interface UpdateUserDTO extends RegisterUserDTO {
    /**
     * @maxLength 1024
     */
    bio?: InsertUser["bio"]
    /**
     * @maxLength 256
     */
    image?: InsertUser["image"]
}

export interface UserDTO
    extends Pick<User, "name" | "email" | "image" | "bio"> {
    token: string
}

export interface UserTokenDTO {
    id: string
    token: string
}
