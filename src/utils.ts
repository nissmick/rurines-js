export const uint8ArrayToB64 = (data: Uint8Array) =>
  btoa([...data].map((n) => String.fromCharCode(n)).join(''))

export const b64ToUint8Array = (data: string) =>
  Uint8Array.from(atob(data), (c) => c.charCodeAt(0))
