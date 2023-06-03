export type ParsedDates<
    T extends {
        createdAt: string
        updatedAt: string
    },
> = Omit<T, "createdAt" | "updatedAt"> & { createdAt: Date; updatedAt: Date }

export type ParsedDatesInsert<
    T extends {
        createdAt?: string
        updatedAt?: string
    },
> = Omit<T, "createdAt" | "updatedAt"> & { createdAt?: Date; updatedAt?: Date }

export function ParseDates(
    target: any,
    propertyName: string,
    descriptor: PropertyDescriptor,
) {
    const originalMethod = descriptor.value

    descriptor.value = async function (...args: any[]) {
        const result = await originalMethod.apply(this, args)

        if (Array.isArray(result)) {
            return result.map((item) => parseItemDates(item))
        } else if (typeof result === "object" && result !== null) {
            return parseItemDates(result)
        }

        return result
    }

    return descriptor
}

function parseItemDates(item: {
    createdAt: string
    updatedAt: string
}): typeof item {
    if (item.createdAt) {
        // @ts-ignore
        item.createdAt = new Date(item.createdAt)
    }

    if (item.updatedAt) {
        // @ts-ignore
        item.updatedAt = new Date(item.updatedAt)
    }

    return item
}
