import { object, optional, string } from '@valibot/valibot'

export const rurinesResolve = object({
  idServer: optional(object({
    url: string()
  })),
  relay: optional(object({
    url: string()
  }))
})
