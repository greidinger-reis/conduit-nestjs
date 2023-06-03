import { Module } from "@nestjs/common"
import { DrizzleService } from "./drizzle.service"
import { MigrationService } from "./migrate.service"

@Module({
    providers: [DrizzleService, MigrationService],
    exports: [DrizzleService],
})
export class DrizzleModule {}
