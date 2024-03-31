import { type UserLike, userLikeToUser, pubKeyToSerializedString } from './user.ts'

export const userToAddress = (userLike: UserLike) => {
  const pub = userLikeToUser(userLike).pub
  return `rurines://user/${pubKeyToSerializedString(pub)}`
}
