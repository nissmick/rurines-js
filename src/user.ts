import type { SignedUser } from './schemas/user.ts'
import { b64ToUint8Array, uint8ArrayToB64 } from './utils.ts'
import { parse } from '@valibot/valibot'
import { signedUser } from './schemas/user.ts'
import { PublicKeyJWK } from './schemas/crypto.ts'
import { Session } from './schemas/user.ts'
import { SignedSession } from './schemas/user.ts'
import { User } from './schemas/user.ts'

/**
 * Serialize public key
 */
export const serializePubKey = (pubKey: PublicKeyJWK): Uint8Array => {
  const normalizedPubJWK = Object.fromEntries(
    Object.entries(pubKey).sort((a, b) => a[0] > b[0] ? 1 : -1),
  )
  const pubJwkJson = JSON.stringify(normalizedPubJWK)
  const encodedJwk = new TextEncoder().encode(pubJwkJson)
  return encodedJwk
}

/**
 * Public key to string
 */
export const pubKeyToSerializedString = (pubKey: PublicKeyJWK): string =>
  uint8ArrayToB64(serializePubKey(pubKey))

/**
 * Generate User
 */
export const generateUser = async (): Promise<SignedUser> => {
  const key = await crypto.subtle.generateKey(
    { name: 'ECDSA', namedCurve: 'P-256' },
    true,
    [
      'sign',
      'verify',
    ],
  )

  const publicKey = await crypto.subtle.exportKey('jwk', key.publicKey)
  const privateKey = await crypto.subtle.exportKey('jwk', key.privateKey)

  const result = parse(signedUser, {
    user: {
      pub: publicKey,
    },
    pvt: privateKey,
  })
  return result
}

interface LoginFunction {
  (signedUser: SignedUser): Promise<SignedSession>
}
export const login: LoginFunction = async (signedUser) => {
  const key = await crypto.subtle.importKey(
    'jwk',
    signedUser.pvt,
    { name: 'ECDSA', namedCurve: 'P-256' },
    true,
    ['sign'],
  )

  const rawSession = await generateUser()
  const serializedSessionPubKey = serializePubKey(rawSession.user.pub)

  const signedSessionPubKey = await crypto.subtle.sign(
    { name: 'ECDSA', hash: { name: 'SHA-256' } },
    key,
    serializedSessionPubKey,
  )

  const session: Session = {
    userPub: signedUser.user.pub,
    pub: rawSession.user.pub,
    signature: uint8ArrayToB64(new Uint8Array(signedSessionPubKey)),
  }

  const signedSession: SignedSession = {
    session,
    pvt: rawSession.pvt,
  }
  return signedSession
}

export const verifySession = async (session: Session): Promise<{
  mstrPubKey: PublicKeyJWK
} | false> => {
  const serializedSessionPubKey = serializePubKey(session.pub)

  const key = await crypto.subtle.importKey(
    'jwk',
    session.userPub,
    {
      name: 'ECDSA',
      namedCurve: 'P-256',
    },
    true,
    ['verify'],
  )

  const isValid = await crypto.subtle.verify(
    { name: 'ECDSA', hash: { name: 'SHA-256' } },
    key,
    b64ToUint8Array(session.signature),
    serializedSessionPubKey,
  )
  if (!isValid) {
    return false
  }
  return {
    mstrPubKey: session.userPub
  }
}
export type UserLike = SignedUser | SignedSession | User | Session
export const userLikeToUser = (userLike: UserLike): User => {
  if ('userPub' in userLike) {
    return {
      pub: userLike.userPub,
    }
  }
  if ('session' in userLike) {
    return {
      pub: userLike.session.pub,
    }
  }
  if ('user' in userLike) {
    return {
      pub: userLike.user.pub,
    }
  }
  return {
    pub: userLike.pub,
  }
}
