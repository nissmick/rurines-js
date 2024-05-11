import { Hono } from 'hono'
import { upgradeWebSocket } from 'hono/deno'
import type { RurinesResolve } from '../src/schemas/server.ts'

const app = new Hono()

app.get('/.rurines_resolve', c => {
  return c.json({
    relay: {
      url: {
        websocket: '/relay/ws'
      }
    }
  } satisfies RurinesResolve)
})

app.get('/relay/ws', upgradeWebSocket(() => ({
  onOpen(evt, ws) {
    console.log(evt)
  },
})))

export default {
  fetch (req: Request) {
    return app.fetch(req)
  }
}