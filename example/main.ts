import * as rurines from '../src/mod.ts'
/*

const user = await rurines.generateUser()
const adress = await rurines.userToAddress(user)

const session = await rurines.login(user)
console.log(session)
console.log(`Your address:
${adress}`)
*/
const relay = await rurines.connectRelay('http://localhost:8000')
if (!relay) {
  throw new Error('relay is null')
}
console.log(relay)