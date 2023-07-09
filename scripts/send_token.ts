import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { HARD_HAT_TOKEN_IMPLEMENTATION_ADDRESS, GANACHE_TOKEN_IMPLEMENTATION_ADDRESS, PALM_TOKEN_IMPLEMENTATION_ADDRESS, GOERLI_TOKEN_IMPLEMENTATION_ADDRESS,  AURORA_TOKEN_IMPLEMENTATION_ADDRESS } from './constants';
require('dotenv').config(); 
const fs = require('fs').promises;


function updateConstantsJson(selected_network, lydiaTokenImpl) {
  return new Promise(async (resolve, reject) => {
    //const constantsJsonPath = './constants.json';
    const constantsJsonPath = 'C:/Users/aax374/Dropbox/England_2022/Work Imperial/Projects/Multi-chain/scripts/constants.json';


    try {
      // Read the JSON file
      const jsonString = await fs.readFile(constantsJsonPath, 'utf8');
      const constantsJson = JSON.parse(jsonString);

      // Update the JSON object based on the selected network
      if (selected_network === 'hardhat') {
        //constantsJson.HARD_HAT_TOKEN_PROXY_ADDRESS = utilityProxy.address;
        constantsJson.HARD_HAT_TOKEN_IMPLEMENTATION_ADDRESS = lydiaTokenImpl.address;
      } else if (selected_network === 'ganache') {
        //constantsJson.GANACHE_TOKEN_PROXY_ADDRESS = utilityProxy.address;
        constantsJson.GANACHE_TOKEN_IMPLEMENTATION_ADDRESS = lydiaTokenImpl.address;
      } else if (selected_network === 'palm') {
        //constantsJson.PALM_TOKEN_PROXY_ADDRESS = utilityProxy.address;
        constantsJson.PALM_TOKEN_IMPLEMENTATION_ADDRESS = lydiaTokenImpl.address;
      } else if (selected_network === 'goerli') {
        //constantsJson.GOERLI_TOKEN_PROXY_ADDRESS = utilityProxy.address;
        constantsJson.GOERLI_TOKEN_IMPLEMENTATION_ADDRESS = lydiaTokenImpl.address;
      } else if (selected_network === 'aurora') {
        //constantsJson.AURORA_TOKEN_PROXY_ADDRESS = utilityProxy.address;
        constantsJson.AURORA_TOKEN_IMPLEMENTATION_ADDRESS = lydiaTokenImpl.address;
      } else {
        throw new Error('Invalid network selected');
      }

      // Convert the updated JSON object back to a string
      const updatedJsonString = JSON.stringify(constantsJson, null, 2);

      // Write the updated JSON string back to the file
      await fs.writeFile(constantsJsonPath, updatedJsonString);

      console.log('Updated constants.json file');
      resolve();
    } catch (error) {
      console.error('Error updating constants.json:', error);
      reject(error);
    }
  });
}

async function main() {
  const prompt = require('prompt-sync')();

  const recipientAddress = prompt('Enter the recipient address: ');
  const amountToBeSent = prompt('Enter the number of tokens to send: ');

  let contractAddress;
  let rpcUrl;

  const selectedNetwork = process.env.HARDHAT_NETWORK || '';

  if (selectedNetwork === 'hardhat') {
    contractAddress = "<HARDHAT_LYDIA_TOKEN_ADDRESS>";
    rpcUrl = "<HARDHAT_RPC_URL>";
  } else if (selectedNetwork === 'ganache') {
    contractAddress = "<GANACHE_LYDIA_TOKEN_ADDRESS>";
    rpcUrl = "<GANACHE_RPC_URL>";
  } else if (selectedNetwork === 'goerli') {
    contractAddress = "<GOERLI_LYDIA_TOKEN_ADDRESS>";
    rpcUrl = "<GOERLI_RPC_URL>";
  } else if (selectedNetwork === 'palm') {
    contractAddress = "<PALM_LYDIA_TOKEN_ADDRESS>";
    rpcUrl = "<PALM_RPC_URL>";
  } else if (selectedNetwork === 'aurora') {
    contractAddress = "<AURORA_LYDIA_TOKEN_ADDRESS>";
    rpcUrl = "<AURORA_RPC_URL>";
  } else {
    throw new Error('Invalid network selected');
  }

  const { token, owner } = await loadFixture(deployLydiaTokenFixture);
  console.log('LydiaTokenImpl contract address:', token.address);


  try {
    await updateConstantsJson(selectedNetwork, token);
    console.log('File update completed.');
  } catch (error) {
    console.error('File update failed:', error);
  }
  const total = await token.totalSupply();
  expect(total).to.equal(await token.balanceOf(owner.address));

  const ownerBalance = await token.balanceOf(owner.address);
  await token.transfer(recipientAddress, amountToBeSent);
  const recipientBalance = await token.balanceOf(recipientAddress);

  console.log(`Recipient balance after transfer: ${recipientBalance.toString()}`);

  // Additional test cases
  // ...

  process.exit(0);
}

async function deployLydiaTokenFixture() {
  const initialSupply = 20000;

  const [owner, otherAccount] = await ethers.getSigners();

  const LydiaToken = await ethers.getContractFactory("LydiaTokenImpl");
  const token = await LydiaToken.deploy();

  return { token, owner, otherAccount };
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
