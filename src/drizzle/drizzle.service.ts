import { Injectable } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { drizzle } from "drizzle-orm/node-postgres"
import { Pool } from "pg"

@Injectable()
export class DrizzleService {
    constructor(private configService: ConfigService) {}

    private queryClient = new Pool({
        connectionString: this.configService.get<string>("DATABASE_URL"),
    })

    public database = drizzle(this.queryClient, {
        logger: this.configService.get<boolean>("DRIZZLE_LOGGING"),
    })
}
