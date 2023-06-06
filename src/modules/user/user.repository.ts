import { Injectable } from "@nestjs/common"
import { DataSource, Repository } from "typeorm"
import { IUserRepository } from "./interfaces/repository"
import { UserEntity } from "./user.entity"

@Injectable()
export class UserRepository
    extends Repository<UserEntity>
    implements IUserRepository
{
    constructor(private readonly dataSource: DataSource) {
        super(UserEntity, dataSource.createEntityManager())
    }

    // @ts-expect-error wtf
    async findByEmail(email: string): Promise<UserEntity | null> {
        return this.findOne({ where: { email } })
    }

    // @ts-expect-error wtf
    async findByName(name: string): Promise<UserEntity | null> {
        return this.findOne({ where: { name } })
    }

    // @ts-expect-error wtf
    async findById(id: string): Promise<UserEntity | null> {
        return this.findOne({ where: { id } })
    }
}
