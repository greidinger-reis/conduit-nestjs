import { Injectable, OnModuleInit } from "@nestjs/common"
import { migrate } from "drizzle-orm/node-postgres/migrator"
import { DrizzleService } from "./drizzle.service"

@Injectable()
export class MigrationService implements OnModuleInit {
    constructor(
        private drizzleService: DrizzleService,
    ) {}

    async onModuleInit() {
        try {
            console.log("Running migrations...")
            await migrate(this.drizzleService.database, {
                migrationsFolder: "drizzle/migrations/",
            })
            console.log("Migrations complete!")
        } catch (error) {
            console.error("Error running migrations:", error)
        }
    }
}
