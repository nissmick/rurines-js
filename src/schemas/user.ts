import { Output, object } from '@valibot/valibot'
import { publicKeyJWK, privateKeyJWK } from './crypto.ts'

/**
 * ユーザー
 */
export const user = object({
  pub: publicKeyJWK
})
export type User = Output<typeof user>

/**
 * 秘密鍵を含むユーザー
 */
export const signedUser = object({
  pub: publicKeyJWK,
  pvt: privateKeyJWK
})
export type SignedUser = Output<typeof signedUser>
