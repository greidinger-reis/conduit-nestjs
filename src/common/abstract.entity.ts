import {
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm"

export interface IAbstractEntity {
    id: string
    /**
     * @format date-time: Date.toISOString()
     * */
    createdAt: Date
    /**
     * @format date-time: Date.toISOString()
     * */
    updatedAt: Date
}

@Entity()
export class AbstractEntity implements IAbstractEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @CreateDateColumn({
        type: "timestamp",
        name: "created_at",
    })
    createdAt: Date

    @UpdateDateColumn({
        type: "timestamp",
        name: "updated_at",
    })
    updatedAt: Date
}
