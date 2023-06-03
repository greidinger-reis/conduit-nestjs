import {monotonicFactory} from "ulid"

const ulid = monotonicFactory()

export function createId(){
    return ulid()
}
