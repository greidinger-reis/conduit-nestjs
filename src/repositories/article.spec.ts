import { describe, it, expect } from "bun:test"
import { faker } from "@faker-js/faker"
import { ArticleRepository } from "../article-repository"
import slugify from "slugify"
import { UserRepository } from "../user-repository"

describe("Create & Delete Article", () => {
    it("should create an article and delete the article", async () => {
        const userRepository = new UserRepository()

        const user = await userRepository.create({
            name: faker.person.fullName(),
            email: faker.internet.email(),
            password: faker.internet.password(),
        })

        const articleRepository = new ArticleRepository()
        const title = faker.lorem.sentence()

        const createdArticle = await articleRepository.create({
            title,
            body: faker.lorem.paragraphs(),
            description: faker.lorem.paragraph(),
            slug: slugify(title, { lower: true }),
            authorId: user.id,
        })

        expect(createdArticle).toHaveProperty("id")
        expect(createdArticle).toHaveProperty("title")
        expect(createdArticle).toHaveProperty("body")
        expect(createdArticle).toHaveProperty("description")
        expect(createdArticle).toHaveProperty("slug")
        expect(createdArticle).toHaveProperty("authorId")
        expect(createdArticle).toHaveProperty("createdAt")
        expect(createdArticle).toHaveProperty("updatedAt")
        expect(createdArticle.createdAt).toBeDate()
        expect(createdArticle.updatedAt).toBeDate()

        await userRepository.delete(user.id)
        await articleRepository.delete(createdArticle.id)
    })
})

describe("Find Article", () => {
    it("should find an article by id", async () => {
        const userRepository = new UserRepository()

        const user = await userRepository.create({
            name: faker.person.fullName(),
            email: faker.internet.email(),
            password: faker.internet.password(),
        })

        const articleRepository = new ArticleRepository()
        const title = faker.lorem.sentence()

        const createdArticle = await articleRepository.create({
            title,
            body: faker.lorem.paragraphs(),
            description: faker.lorem.paragraph(),
            slug: slugify(title, { lower: true }),
            authorId: user.id,
        })

        const foundArticle = await articleRepository.findById(createdArticle.id)

        expect(foundArticle).toBeDefined()
        expect(foundArticle).toHaveProperty("id")
        expect(foundArticle).toHaveProperty("title")
        expect(foundArticle).toHaveProperty("body")
        expect(foundArticle).toHaveProperty("description")
        expect(foundArticle).toHaveProperty("slug")
        expect(foundArticle).toHaveProperty("authorId")
        expect(foundArticle).toHaveProperty("createdAt")
        expect(foundArticle).toHaveProperty("updatedAt")
        //@ts-expect-error
        expect(foundArticle.createdAt).toBeDate()
        //@ts-expect-error
        expect(foundArticle.updatedAt).toBeDate()

        await userRepository.delete(user.id)
        await articleRepository.delete(createdArticle.id)
    })
})

describe("Update Article", () => {
    it("should update an article", async () => {
        const userRepository = new UserRepository()

        const user = await userRepository.create({
            name: faker.person.fullName(),
            email: faker.internet.email(),
            password: faker.internet.password(),
        })

        const articleRepository = new ArticleRepository()
        const title = faker.lorem.sentence()

        const createdArticle = await articleRepository.create({
            title,
            body: faker.lorem.paragraphs(),
            description: faker.lorem.paragraph(),
            slug: slugify(title, { lower: true }),
            authorId: user.id,
        })

        const updatedArticle = await articleRepository.update(
            createdArticle.id,
            {
                title: "Updated Title",
                body: "Updated Body",
                description: "Updated Description",
                slug: "updated-slug",
                authorId: user.id,
            }
        )

        expect(updatedArticle).toBeDefined()
        expect(updatedArticle).toHaveProperty("id")
        expect(updatedArticle.id).toBe(createdArticle.id)
        expect(updatedArticle).toHaveProperty("title")
        expect(updatedArticle).toHaveProperty("body")
        expect(updatedArticle).toHaveProperty("description")
        expect(updatedArticle).toHaveProperty("slug")
        expect(updatedArticle).toHaveProperty("authorId")
        expect(updatedArticle).toHaveProperty("createdAt")
        expect(updatedArticle).toHaveProperty("updatedAt")
        expect(updatedArticle.createdAt).toBeDate()
        expect(updatedArticle.updatedAt).toBeDate()

        await userRepository.delete(user.id)
        await articleRepository.delete(createdArticle.id)
    })
})
