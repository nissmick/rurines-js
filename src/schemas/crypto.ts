import { Output, literal, object, string, union } from '@valibot/valibot'

/**
 * Public Key
 */
export const publicKeyJWK = union([
  /**
   * 楕円曲線暗号
   */
  object({
    /**
     * Key Type
     */
    kty: literal('EC'),
    crv: literal('P-256'),
    alg: literal('ES256'),
    x: string(),
    y: string(),
  }),
])
export type PublicKeyJWK = Output<typeof publicKeyJWK>

/**
 * Private Key
 */
export const privateKeyJWK = union([
  /**
   * 楕円曲線暗号
   */
  object({
    /**
     * Key Type
     */
    kty: literal('EC'),
    crv: literal('P-256'),
    alg: literal('ES256'),
    x: string(),
    y: string(),
    d: string()
  }),
])
export type PrivateKeyJWK = Output<typeof privateKeyJWK>
