import { type BaseSchema, object, unknown } from '@valibot/valibot'
import { session } from './user.ts'

/**
 * Create custom event schema
 * @param data Data Schema
 * @returns Valibot Schema
 */
export const customEvent = <T extends BaseSchema>(data: T) => object({
  dat: data,
  sess: session
})

export const unknownEvent = customEvent(unknown())
