const fs = require("fs")
const path = require("path")

const getCommunityAbi = () => {
  try {
    /*const dir = path.resolve(
      __dirname,
      "./artifacts/contracts/community\\MultiChainCommunity.sol/MultiChainCommunity.json"
    )*/

    const dir = path.resolve(
      __dirname,
      "../artifacts/contracts/community/MultiChainCommunity.sol/MultiChainCommunity.json"
    )
    const file = fs.readFileSync(dir, "utf8")
    const json = JSON.parse(file)
    const abi = json.abi
    console.log(`abi`, abi)

    return abi
  } catch (e) {
    console.log(`e`, e)
  }
}
const getTokenAbi = () => {
  try {

    const dir = path.resolve(
      __dirname,
      "../artifacts/contracts/token/LydiaTokenImpl.sol/LydiaTokenImpl.json"
    )
    const file = fs.readFileSync(dir, "utf8")
    const json = JSON.parse(file)
    const abi = json.abi
    console.log(`abi`, abi)

    return abi
  } catch (e) {
    console.log(`e`, e)
  }
}
getCommunityAbi();
getTokenAbi();