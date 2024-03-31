import type { SignedUser } from './schemas/user.ts'
import type { PublicKeyJWK, PrivateKeyJWK } from './schemas/crypto.ts'
import { uint8ArrayToB64 } from './utils.ts'
import { parse } from '@valibot/valibot'
import { signedUser } from './schemas/user.ts'

interface PublicUserData {
  pub: Uint8Array
}

export const userToAddress = async (user: SignedUser): Promise<string> => {
  const normalizedPubJWK = Object.fromEntries(Object.entries(user.pub).sort((a, b) => a[0] > b[0] ? 1 : -1))
  const pubJwkJson = JSON.stringify(normalizedPubJWK)
  const encodedJwk = new TextEncoder().encode(pubJwkJson)

  return `rurines://user/${uint8ArrayToB64(encodedJwk)}`
}

export const generateUser = async (): Promise<SignedUser> => {
  const key = await crypto.subtle.generateKey({ name: 'ECDSA', namedCurve: 'P-256' }, true, [
    'sign',
    'verify',
  ])

  const publicKey = await crypto.subtle.exportKey('jwk', key.publicKey)
  const privateKey = await crypto.subtle.exportKey('jwk', key.privateKey)

  const result = parse(signedUser, {
    pub: publicKey,
    pvt: privateKey,
  })
  return result
}
