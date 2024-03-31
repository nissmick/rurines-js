import * as rurines from '../src/mod.ts'

const user = await rurines.generateUser()
const adress = await rurines.userToAddress(user)

console.log(`Your address:
${adress}`)
