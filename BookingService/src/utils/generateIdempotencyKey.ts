import { v4 as uuid4 } from "uuid"

export function generateIdempotencyKey():string{
    return uuid4()
}