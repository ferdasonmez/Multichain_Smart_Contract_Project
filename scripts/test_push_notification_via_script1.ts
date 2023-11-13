import * as PushAPI from "@pushprotocol/restapi";
import { HARD_HAT_RPC_URL, PALM_RPC_URL, GANACHE_RPC_URL, GOERLI_RPC_URL, AURORA_RPC_URL, DEFAULT_ACCOUNT } from './constants';
import { PRIVATE_KEY_FOR_DEFAULT_ACCOUNT } from './constants';
async function main() {

  const selected_network = process.env.HARDHAT_NETWORK;
  let owner_address: string = '';
  let rpcUrl: string = '';
  owner_address = DEFAULT_ACCOUNT;
  if (selected_network === "hardhat") {
    rpcUrl= HARD_HAT_RPC_URL; 
  }  else if (selected_network === "ganache") {
    rpcUrl= GANACHE_RPC_URL;
  } else if (selected_network === "goerli") {
    rpcUrl= GOERLI_RPC_URL; 
  }else if (selected_network === "palm") {
    rpcUrl= PALM_RPC_URL; 
  } else if (selected_network === "aurora") {
    rpcUrl= AURORA_RPC_URL; 
  } else {
    throw new Error('Invalid chain selected');
  }
  
  const provider = new ethers.providers.JsonRpcProvider(
    rpcUrl
  );

const _signer = new ethers.Wallet(PRIVATE_KEY_FOR_DEFAULT_ACCOUNT);
console.log("Signer Address is", _signer.getAddress());
const apiResponse = await PushAPI.payloads.sendNotification({
  signer: _signer,
  type: 3, // target
  identityType: 2, // direct payload
  notification: {
    title: '[SDK-TEST] notification TITLE:',
    body: '[sdk-test] notification BODY'
  },
  payload: {
    title: '[sdk-test] payload title',
    body: 'sample msg body',
    cta: '',
    img: ''
  },
  //recipients: 'eip155:5:0x6F7919412318E65109c5698bd0E640fc33DE2337, eip155:5:0x6f8f6D4AEd9A94ca0d6DDBCE06482c6ed28bD95A', // recipient address
  recipients: 'eip155:5:0x6f8f6D4AEd9A94ca0d6DDBCE06482c6ed28bD95A',
  channel: 'eip155:5:0x6f8f6D4AEd9A94ca0d6DDBCE06482c6ed28bD95A', // your channel address
  env: 'staging'
});

}
main(); 

