import { Output, safeParse, type BaseSchema } from '@valibot/valibot'
import { rurinesResolve } from './schemas/server.ts'
import { UnknownEvent, unknownEvent } from './schemas/events.ts'

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

/**
 * Connected Relay
 */
export interface ConnectedRelay {
  info: {}
  readable: ReadableStream<UnknownEvent>
  writable: WritableStream<UnknownEvent>
}

interface EventProtocol {
  readable: ReadableStream<UnknownEvent>
  writable: WritableStream<UnknownEvent>
}

const parseJSONEvent = (json: string): UnknownEvent | null => {
  let object: unknown
  try {
    object = JSON.parse(json)
  } catch (_e) {
    // Parse Error
    return null
  }
  const parsed = safeParse(unknownEvent, object)

  return parsed.success ? parsed.output : null
}

const connectUseWebSocket = (url: string): EventProtocol => {
  const ws = new WebSocket(url)
  return {
    readable: new ReadableStream({
      start (ctrler) {
        ws.onmessage = (evt) => {
          if (typeof evt.data !== 'string') {
            // Not string, ignore
            return
          }
          const parsed = parseJSONEvent(evt.data)
          if (!parsed) {
            // It's invalid event, then ignore
            return
          }
          ctrler.enqueue(parsed as UnknownEvent)
        }
      }
    }),
    writable: new WritableStream({
      write (event) {
        const json = JSON.stringify(event)
        ws.send(json)
      }
    })
  }
}

/**
 * Connect to relay using relay URL
 * @param url Relay URL
 * @returns ConnectedRelay
 */
export const connectRelay = async (url: string): Promise<ConnectedRelay | null> => {
  const resolveUrl = new URL('/.rurines_resolve', url)

  // fetch server info
  const resolveData = await safeFetchJSON(resolveUrl, rurinesResolve)

  const relayUrl = resolveData?.relay?.url

  if (!relayUrl) {
    return null
  }

  const connectedProtocols: EventProtocol[] = []

  if (relayUrl.websocket) {
    const wsUrl = new URL(relayUrl.websocket, url).href
    connectedProtocols.push(connectUseWebSocket(wsUrl))
  }
  const readable = new ReadableStream<UnknownEvent>({
    start (ctrler) {
      for (const connectedProtocol of connectedProtocols) {
        const reader = connectedProtocol.readable.getReader()
        ;(async () => {
          while (true) {
            const readContent = await reader.read()
            if (readContent.value) {
              ctrler.enqueue(readContent.value)
            }
            if (readContent.done) {
              break
            }
          }
        })()
      }
    }
  })
  const writable = connectedProtocols[0]?.writable
  if (!writable) {
    return null
  }
  return {
    readable,
    writable,
    info: {}
  }
}
