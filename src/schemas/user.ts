import { Output, object, string } from '@valibot/valibot'
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
  user,
  pvt: privateKeyJWK
})
export type SignedUser = Output<typeof signedUser>

export const session = object({
  /**
   * セッションの公開鍵
   */
  pub: publicKeyJWK,
  
  /**
   * `pub`をシリアライズして親鍵で署名したもの、base64
   */
  signature: string(),

  /**
   * 親の公開鍵
   */
  userPub: publicKeyJWK
})
export type Session = Output<typeof session>

export const signedSession = object({
  session,
  pvt: privateKeyJWK
})
export type SignedSession = Output<typeof signedSession>
