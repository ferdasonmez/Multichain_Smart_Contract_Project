import Web3 from 'web3';
import { AbiItem} from 'web3-utils';
import { Contract } from 'web3-eth-contract';
import { toChecksumAddress } from 'web3-utils';
import { COMMUNITY_ABI } from './abi_constants';
import { HARD_HAT_RPC_URL, PALM_RPC_URL, GANACHE_RPC_URL, GOERLI_RPC_URL, AURORA_RPC_URL, DEFAULT_ACCOUNT } from './constants';
import { ethers } from "ethers";
import { BigNumber } from 'ethers';


import {
  HARD_HAT_COMMUNITY_IMPLEMENTATION_ADDRESS,
  PALM_COMMUNITY_IMPLEMENTATION_ADDRESS,
  AURORA_COMMUNITY_IMPLEMENTATION_ADDRESS,
  GANACHE_COMMUNITY_IMPLEMENTATION_ADDRESS,
  GOERLI_COMMUNITY_IMPLEMENTATION_ADDRESS
} from './constants';



const prompt = require('prompt-sync')();
const fs = require("fs");
const path = require("path");
const selected_network = process.env.HARDHAT_NETWORK;
let contract_address: string = '';
let web3: Web3;
let windowTitle: string = '';
declare global {
  interface Window {
    ethereum?: any;
  }
}
async function connectWallet(): Promise<Web3> {
  // Check if Web3 is already injected by the provider (e.g., Metamask)
  if (typeof window.ethereum !== 'undefined') {
    try {
      // Request access to the user's accounts
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      // Create a new instance of Web3 using the provider
      const web3 = new Web3(window.ethereum);
      return web3;
    } catch (error) {
      throw new Error('Failed to connect to the wallet.');
    }
  } else {
    throw new Error('No web3 provider found. Please install Metamask or use a compatible Ethereum browser.');
  }
}

function getTheAbi () {
  try {
    /*const dir = path.resolve(
      __dirname,
      "./artifacts/contracts/community\\MultiChainCommunity.sol/MultiChainCommunity.json"
    )*/

    const dir = path.resolve(
      __dirname,
      "./../artifacts/contracts/community/MultiChainCommunity.sol/MultiChainCommunity.json"
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
getTheAbi();

var provider: ethers.providers.JsonRpcProvider;
if (selected_network === 'hardhat') {
  provider = new ethers.providers.JsonRpcProvider(HARD_HAT_RPC_URL);
  contract_address = HARD_HAT_COMMUNITY_IMPLEMENTATION_ADDRESS;
  web3 = new Web3(HARD_HAT_RPC_URL);
  windowTitle = 'Hardhat Community CLI Client';
} else if (selected_network === 'ganache') {
  provider = new ethers.providers.JsonRpcProvider(GANACHE_RPC_URL);
  contract_address = GANACHE_COMMUNITY_IMPLEMENTATION_ADDRESS;
  web3 = new Web3(GANACHE_RPC_URL);
  windowTitle = 'Ganache Community CLI Client';
} else if (selected_network === 'goerli') {
  provider = new ethers.providers.JsonRpcProvider(GOERLI_RPC_URL);
  contract_address = GOERLI_COMMUNITY_IMPLEMENTATION_ADDRESS;
  web3 = new Web3(GOERLI_RPC_URL);
  windowTitle = 'Goerli Community CLI Client';
} else if (selected_network === 'palm') {
  provider = new ethers.providers.JsonRpcProvider(PALM_RPC_URL);
  contract_address = PALM_COMMUNITY_IMPLEMENTATION_ADDRESS;
  web3 = new Web3(PALM_RPC_URL);
  windowTitle = 'Palm Community CLI Client';
} else if (selected_network === 'aurora') {
  provider = new ethers.providers.JsonRpcProvider(AURORA_RPC_URL);
  contract_address = AURORA_COMMUNITY_IMPLEMENTATION_ADDRESS;
  web3 = new Web3(AURORA_RPC_URL);
  windowTitle = 'Aurora Community CLI Client';
} else {
  throw new Error('Invalid chain selected');
}
web3.eth.defaultAccount = DEFAULT_ACCOUNT;
// Set the window title
process.title = windowTitle;


new ethers.providers.JsonRpcProvider("YOUR_RPC_URL");
//const contract = new web3.eth.Contract(COMMUNITY_ABI as AbiItem[], contract_address);
const contract = new web3.eth.Contract(getTheAbi(), contract_address);
const contract_ethers = new ethers.Contract(contract_address, getTheAbi(), provider);




try {
  // Attempt to instantiate a contract with the ABI
  const contract = new web3.eth.Contract(getTheAbi());
  console.log('ABI is valid');
} catch (error) {
  console.error('ABI is not valid', error);
}
function get_community_balance(token_address: string): Promise<number> {
  token_address = toChecksumAddress(token_address);
  return contract.methods.getCommunityBalance(token_address).call();
}
/*function get_slots(): Promise<[number, number]> {
  return contract.methods.getSlotNumbers().call();
}*/
async function add_member(
  account: string, chain_id: number, tags: string[]): Promise<void> {
  const gasPrice = await provider.getGasPrice();
  console.log("Gas price:", gasPrice.toString());
  const estimateAddMember = await contract_ethers.estimateGas.addMember(account, chain_id, tags);
  const gasCostAddMember = estimateAddMember.mul(gasPrice);
  console.log("estimateAddMember", estimateAddMember);
  console.log("Gas cost for addMember:", gasCostAddMember.toString());

  //const gasCostAddMember = estimateAddMember.mul(gasPrice);
  //console.log("Gas cost for addMember:", gasCostAddMember.toString());
 //return;

  return contract.methods.addMember(account, chain_id, tags).call();
}
async function remove_member(account: string, chain_id: number): Promise<void> {
  const gasPrice = await provider.getGasPrice();
  console.log("Gas price:", gasPrice.toString());
  const estimateRemoveMember = await contract_ethers.estimateGas.removeMember(account, chain_id);
  const gasCostRemoveMember = estimateRemoveMember.mul(gasPrice);
  console.log("estimateRemoveMember", estimateRemoveMember);
  console.log("Gas cost for removeMember:", gasCostRemoveMember.toString());
  return contract.methods.removeMember(account, chain_id).call();
}

async function makeProposal(
  description: string,
  votingType: number,
  votingStructure: string,
  startTime: number,
  endTime: number,
  proposalImplementationAddress: string,
  proposalBudget: number,
  quorum: number
): Promise<number> {
  return contract.methods.makeProposal(
    description,
    votingType,
    votingStructure,
    startTime,
    endTime,
    proposalImplementationAddress,
    proposalBudget,
    quorum
  ).call();
}
function denemeWithoutParam(): Promise<void> {
  return contract.methods.denemeWithoutParam().call();
}
function denemeWithParam(param: string ): Promise<void> {
  return contract.methods.denemeWithParam(param).call();
}
function promptProposalInput(): any {
  const proposalJson = prompt('Enter proposal JSON: ');

  try {
    const proposalJsonParsed = JSON.parse(proposalJson);
    return proposalJsonParsed;
  } catch (error) {
    console.error('Invalid JSON format');
    return null;
  }
}
(async function main() {
  while (true) {
    try {
      const command = prompt('Enter command (d1, d2, get_balance, add_member, remove_member, make_proposal, exit): ');

      if (command === 'exit') {
        break;
      } /*else if (command === 's') {
        const[slotA, slotb] = await get_slots();
        console.log(`Slots: ${slotA}, ${slotb}`);
      }*/else if (command === 'get_balance') {
        const token_address = prompt('Enter token address: ');
        const balance = await get_community_balance(token_address);
        console.log(`Community balance: ${balance}`);
      } else if (command === 'add_member') {
        const account = prompt('Enter account address: ');
        const chainIdStr = prompt('Enter chain ID:');
        const chainId = parseInt(chainIdStr);
        if (isNaN(chainId)) {
          console.error('Invalid chain ID');
          continue;
        }
        const tagsStr = prompt('Enter tags (comma-separated):');
        const tags = tagsStr.split(',').map((tag: string) => tag.trim());
        try {
          await add_member(account, chainId, tags);
        } catch (error) {
          console.error('Error adding member:', error);
        }
      }
      else if (command === 'remove_member') {
        const account = prompt('Enter account address: ');
        const chainIdStr = prompt('Enter chain ID:');
        const chainId = parseInt(chainIdStr);
        if (isNaN(chainId)) {
          console.error('Invalid chain ID');
          continue;
        }
        try {
          await remove_member(account, chainId);
        } catch (error) {
          console.error('Error removing member:', error);
        }
      }
      else if (command === 'make_proposal') {
        const proposalJsonParsed = promptProposalInput();

        if (proposalJsonParsed) {
          try {
            const proposalId = await makeProposal(
              proposalJsonParsed.description,
              proposalJsonParsed.votingType,
              proposalJsonParsed.votingStructure,
              proposalJsonParsed.startTime,
              proposalJsonParsed.endTime,
              proposalJsonParsed.proposalImplementationAddress,
              proposalJsonParsed.proposalBudget,
              proposalJsonParsed.quorum
            );

            console.log('Proposal created with ID:', proposalId);
          } catch (error) {
            console.error('Error creating proposal:', error);
          }
        }
      } // Closing parenthesis for 'else if (command === 'make_proposal')' block
    
      else if (command === 'd1') {
        try {
          const result = await denemeWithoutParam();
          console.log('Response:', result);
        } catch (error) {
          console.error('Error denemeWithoutParam :', error);
        }
      }else if (command === 'd2') {
        const param = prompt('Enter input text: ');
       
        try {
          const result = await denemeWithParam(param);
          console.log('Response:', result);
        } catch (error) {
          console.error('Error denemeWithoutParam :', error);
        }
      }
    } catch (error) {
      console.error('An error occurred before if:', error);
    }
  }
})();
