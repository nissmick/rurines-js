import { type Output, object, optional, string } from '@valibot/valibot'

export const rurinesResolve = object({
  idServer: optional(object({
    url: string()
  })),
  relay: optional(object({
    url: object({
      websocket: optional(string())
    })
  }))
})
export type RurinesResolve = Output<typeof rurinesResolve>
