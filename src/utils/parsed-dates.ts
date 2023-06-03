export type ParsedDates<
    T extends {
        createdAt: string
        updatedAt: string
    }
> = Omit<T, "createdAt" | "updatedAt"> & { createdAt: Date; updatedAt: Date }

export type ParsedDatesInsert<
    T extends {
        createdAt?: string
        updatedAt?: string
    }
> = Omit<T, "createdAt" | "updatedAt"> & { createdAt?: Date; updatedAt?: Date }
