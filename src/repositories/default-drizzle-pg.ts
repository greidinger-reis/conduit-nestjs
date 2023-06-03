import { InferModel, eq } from "drizzle-orm"
import { AnyPgTable } from "drizzle-orm/pg-core"
import { createId } from "@/utils/create-id"
import { ParsedDates, ParsedDatesInsert } from "@/utils/parse-dates"
import { Repository } from "."
import { DrizzleService } from "@/drizzle/drizzle.service"

export abstract class DefaultDrizzlePgRepository<
    T extends AnyPgTable,
    //@ts-expect-error Drizzle-orm is not generic
    U extends ParsedDates<InferModel<T, "select">>,
    V extends ParsedDatesInsert<InferModel<T, "insert">>,
    //TODO: fix this type
    //@ts-expect-error Little type mismatch here. V is Partial<U> but InferModel<T, "insert"> is not completely Partial of T.
> extends Repository<U, V> {
    constructor(protected table: T, protected drizzleService: DrizzleService) {
        super()
    }

    /**
     * @throws Error
     */
    async create(data: Omit<V, "id">): Promise<U> {
        //@ts-expect-error id should exist on every table
        data.id = createId()

        //@ts-expect-error wtf
        const [created] = await this.drizzleService.database
            .insert(this.table)
            //@ts-expect-error id is created above
            .values(data)
            .returning()

        return created as U
    }

    /**
     * @throws Error
     */
    async update(id: string, data: Omit<V, "id">): Promise<U> {
        //@ts-expect-error wtf
        const [updated] = await this.drizzleService.database
            .update(this.table)
            //TODO: fix this type
            //@ts-expect-error Little type mismatch here.
            .set(data)
            //TODO: Fix this type. I don't think it's possible, Drizzle-ORM is not that generic.
            //@ts-expect-error id should exist on every table
            .where(eq(this.table.id, id))
            .returning()
        return updated as U
    }

    async findAll(limit: number, offset: number): Promise<U[]> {
        return (await this.drizzleService.database
            .select()
            .from(this.table)
            .limit(limit)
            .offset(offset)) as unknown as U[]
    }

    async findById(id: string): Promise<U | null> {
        const [found] = await this.drizzleService.database
            .select()
            .from(this.table)
            //TODO: Fix this type. I don't think it's possible, Drizzle-ORM is not that generic.
            //@ts-expect-error id should exist on every table
            .where(eq(this.table.id, id))
            .limit(1)
        if (!found.id) return null
        return found as U
    }

    /**
     * @throws Error
     */
    async delete(id: string): Promise<U> {
        //@ts-expect-error wtf
        const [deleted] = await this.drizzleService.database
            .delete(this.table)
            //TODO: Fix this type. I don't think it's possible, Drizzle-ORM is not that generic.
            //@ts-expect-error id should exist on every table
            .where(eq(this.table.id, id))
            .returning()
        return deleted as U
    }
}
