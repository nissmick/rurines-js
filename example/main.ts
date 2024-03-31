import * as rurines from '../src/mod.ts'

const user = await rurines.generateUser()
const adress = await rurines.userToAddress(user)

const session = await rurines.login(user)
console.log(session)
console.log(`Your address:
${adress}`)
