import { Output, safeParse, type BaseSchema } from '@valibot/valibot'
import { rurinesResolve } from './schemas/server.ts'

const safeFetchJSON = async <T extends BaseSchema>(url: string | URL, schema: T): Promise<Output<T> | null> => {
  let json: unknown
  try {
    json = await fetch(url).then(res => res.json())
  } catch (_error) {
    return null
  }
  const parsed = safeParse(schema, json)
  if (parsed.success) {
    return parsed.output
  }
  return null
}
export const connectRelay = async (url: string) => {
  const resolveUrl = new URL('/.rurines_resolve', url)

  // fetch server info
  const resolveData = await safeFetchJSON(resolveUrl, rurinesResolve)

  const relayUrl = resolveData?.relay?.url
  
  
}
