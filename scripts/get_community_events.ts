import { HARD_HAT_RPC_URL, GANACHE_RPC_URL, GOERLI_RPC_URL, PALM_RPC_URL, AURORA_RPC_URL } from './constants';
import { HARD_HAT_COMMUNITY_IMPLEMENTATION_ADDRESS, GOERLI_COMMUNITY_IMPLEMENTATION_ADDRESS, GANACHE_COMMUNITY_IMPLEMENTATION_ADDRESS, PALM_COMMUNITY_IMPLEMENTATION_ADDRESS, AURORA_COMMUNITY_IMPLEMENTATION_ADDRESS } from './constants';
import { HARD_HAT_WS_URL, GANACHE_WS_URL, GOERLI_WS_URL, PALM_WS_URL, AURORA_WS_URL } from './constants';
import { PRIVATE_KEY_FOR_DEFAULT_ACCOUNT, DEFAULT_ACCOUNT } from './constants';
import { COMMUNITY_ABI } from './abi_constants';
import Web3 from 'web3';
import { ethers, providers, Contract } from 'ethers';


const fs = require("fs");
const path = require("path");

function getTheAbi () {
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
    //console.log(`abi`, abi)

    return abi
  } catch (e) {
    console.log(`e`, e)
  }
}
async function main() {
  try {
    const selected_network = process.env.HARDHAT_NETWORK;

    let contract_address: string = '';
    let web3: Web3;
    let windowTitle: string = '';
    let rpcUrl: string = '';
    let wsUrl: string = '';
    
    if (selected_network === "hardhat") {
      rpcUrl= HARD_HAT_RPC_URL; 
      wsUrl = HARD_HAT_WS_URL;
      contract_address = HARD_HAT_COMMUNITY_IMPLEMENTATION_ADDRESS;
      web3 = new Web3(HARD_HAT_WS_URL);
      windowTitle = 'Hardhat Community Event Listener';
    }  else if (selected_network === "ganache") {
      rpcUrl= GANACHE_RPC_URL;
      wsUrl = GANACHE_WS_URL; 
      contract_address = GANACHE_COMMUNITY_IMPLEMENTATION_ADDRESS;
      web3 = new Web3(GANACHE_WS_URL);
      windowTitle = 'Ganache Community Event Listener';
    } else if (selected_network === "goerli") {
      rpcUrl= GOERLI_RPC_URL; 
      wsUrl=GOERLI_WS_URL;
      contract_address = GOERLI_COMMUNITY_IMPLEMENTATION_ADDRESS;
      web3 = new Web3(GOERLI_WS_URL);
      windowTitle = 'Goerli Community Event Listener';
    }else if (selected_network === "palm") {
      rpcUrl= PALM_RPC_URL; 
      wsUrl= AURORA_WS_URL;
      contract_address = PALM_COMMUNITY_IMPLEMENTATION_ADDRESS;
      web3 = new Web3(PALM_WS_URL);
      windowTitle = 'Palm Community Event Listener';
    } else if (selected_network === "aurora") {
      rpcUrl= AURORA_RPC_URL; 
      wsUrl=AURORA_WS_URL;
      contract_address = AURORA_COMMUNITY_IMPLEMENTATION_ADDRESS;
      web3 = new Web3(AURORA_WS_URL);
      windowTitle = 'Aurora Community Event Listener';
    } else {
      throw new Error('Invalid chain selected');
    }
    process.title = windowTitle;
    console.log(wsUrl)
    const provider = new providers.WebSocketProvider(wsUrl);
    provider.on('connection', function(connection) {
      // Generate a unique code for every user

      console.log(`Recieved a new connection.`);
    });
   //const contract = new Contract(contract_address, COMMUNITY_ABI, provider);
    //const contract = new Contract(contract_address, getTheAbi(), provider);
    const contract = new web3.eth.Contract(getTheAbi(), contract_address)
    console.log("Contract i olusturdum")
// initialize common variables that we will need
    var transactionHashArr = [];
    let string = ","
    const writeStream = fs.createWriteStream('data.csv');
    //blocknumbers should be modified it will be even better if we can read all events but I tried so, it was too slow. What is the best practise to read events, repeatedly?
    
    for( var j = 9317910; j < 9317922; j = j + 1) {
      console.log(j);
      var k = j + 1
      await wait(1000);
      // get past events that are transfers
      contract.getPastEvents('MemberAdded', {
        fromBlock: j,
        toBlock: k
      }, function(error, events){
        if(!error){
           // for each transfer event, append to the transaction has array and
           // write it to file alongside a comma
            for(var i=0;i<events.length;i++){
                transactionHashArr.push(events[i].transactionHash)
                writeStream.write(events[i].transactionHash);
                writeStream.write(string);
            }
        }
      })
     }
    /*contract.on("MemberAdded", async (account, chainId, tags) => {
      console.log("I caught the event", account, chainId, tags);
    });*/
    
    // Keep the script running indefinitely
    await new Promise(() => {});
  } catch(error) {
    console.error(error);
  }
}
async function wait(ms: number): Promise<void> {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });
}
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
