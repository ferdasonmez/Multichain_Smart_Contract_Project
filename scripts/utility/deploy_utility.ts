import { ethers } from 'hardhat';
import * as Constants from '../constants';
import { UtilityFactory, UtilityProxyFactory, UtilityProxy } from './typechain';
//import * as Constants from '../constants';
import { HARD_HAT_UTILITY_PROXY_ADDRESS, HARD_HAT_UTILITY_IMPLEMENTATION_ADDRESS, GANACHE_UTILITY_PROXY_ADDRESS, GANACHE_UTILITY_IMPLEMENTATION_ADDRESS,  PALM_UTILITY_PROXY_ADDRESS, PALM_UTILITY_IMPLEMENTATION_ADDRESS,  AURORA_UTILITY_PROXY_ADDRESS, AURORA_UTILITY_IMPLEMENTATION_ADDRESS } from '../constants';
require('dotenv').config(); 
const fs = require('fs').promises;


function updateConstantsJson(selected_network, utilityProxy, utility) {
  return new Promise(async (resolve, reject) => {
    //const constantsJsonPath = '../constants.json';
    const constantsJsonPath = 'C:/Users/aax374/Dropbox/England_2022/Work Imperial/Projects/Multi-chain/scripts/constants.json';


    try {
      // Read the JSON file
      const jsonString = await fs.readFile(constantsJsonPath, 'utf8');
      const constantsJson = JSON.parse(jsonString);

      // Update the JSON object based on the selected network
      if (selected_network === 'hardhat') {
        constantsJson.HARD_HAT_UTILITY_PROXY_ADDRESS = utilityProxy.address;
        constantsJson.HARD_HAT_UTILITY_IMPLEMENTATION_ADDRESS = utility.address;
      } else if (selected_network === 'ganache') {
        constantsJson.GANACHE_UTILITY_PROXY_ADDRESS = utilityProxy.address;
        constantsJson.GANACHE_UTILITY_IMPLEMENTATION_ADDRESS = utility.address;
      } else if (selected_network === 'palm') {
        constantsJson.PALM_UTILITY_PROXY_ADDRESS = utilityProxy.address;
        constantsJson.PALM_UTILITY_IMPLEMENTATION_ADDRESS = utility.address;
      } else if (selected_network === 'goerli') {
        constantsJson.GOERLI_UTILITY_PROXY_ADDRESS = utilityProxy.address;
        constantsJson.GOERLI_UTILITY_IMPLEMENTATION_ADDRESS = utility.address;
      } else if (selected_network === 'aurora') {
        constantsJson.AURORA_UTILITY_PROXY_ADDRESS = utilityProxy.address;
        constantsJson.AURORA_UTILITY_IMPLEMENTATION_ADDRESS = utility.address;
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
    const [deployer] = await ethers.getSigners();

    let selected_network: string = process.env.HARDHAT_NETWORK || '';
    //require(selected_network.length > 0, 'No network parameter provided.');
    
    console.log(selected_network);
    console.log(deployer.address);    
    console.log(`Deploying contracts on ${selected_network} network with the account: ${deployer.address}`);

    const chainNames = [process.env.ETHEREUM_MAIN_NETWORK_CHAIN_NAME, process.env.ETHEREUM_CLASSIC_MAIN_NETWORK_CHAIN_NAME, process.env.HARDHAT_CHAIN_NAME, process.env.GANACHE_CHAIN_NAME,  process.env.GOERLI_CHAIN_NAME, process.env.PALM_CHAIN_NAME, process.env.AURORA_CHAIN_NAME];
    //console.log(process.env.ETHEREUM_MAIN_NETWORK_CHAIN_NAME, process.env.ETHEREUM_CLASSIC_MAIN_NETWORK_CHAIN_NAME, process.env.HARDHAT_CHAIN_NAME, process.env.GANACHE_CHAIN_NAME,  process.env.GOERLI_CHAIN_NAME, process.env.PALM_CHAIN_NAME, process.env.AURORA_CHAIN_NAME);
    const chainIds = [ process.env.ETHEREUM_MAIN_NETWORK_CHAIN_ID, process.env.ETHEREUM_CLASSIC_MAIN_NETWORK_CHAIN_ID, process.env.HARDHAT_CHAIN_ID, process.env.GANACHE_CHAIN_ID, process.env.GOERLI_CHAIN_ID, process.env.PALM_CHAIN_ID,  process.env.AURORA_CHAIN_ID];
    //console.log(process.env.ETHEREUM_MAIN_NETWORK_CHAIN_ID, process.env.ETHEREUM_CLASSIC_MAIN_NETWORK_CHAIN_ID, process.env.HARDHAT_CHAIN_ID, process.env.GANACHE_CHAIN_ID, process.env.GOERLI_CHAIN_ID, process.env.PALM_CHAIN_ID,  process.env.AURORA_CHAIN_ID);

    const utilityFactory = (await ethers.getContractFactory(
      'UtilityImpl'
    )) as UtilityFactory;

    const utility = await utilityFactory.deploy(chainNames, chainIds, { gasLimit: 5000000 });

    console.log('UtilityImpl contract address:', utility.address);

    const utilityProxyFactory = (await ethers.getContractFactory(
      'UtilityProxy'
    )) as UtilityProxyFactory;
    const utilityProxy = await utilityProxyFactory.deploy();

    console.log('UtilityProxy contract address:', utilityProxy.address);

    await utilityProxy.setImplementation(utility.address);

    console.log('UtilityProxy implementation set to UtilityImpl');

    try {
      await updateConstantsJson(selected_network, utilityProxy, utility);
      console.log('File update completed.');
    } catch (error) {
      console.error('File update failed:', error);
    }

  }

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
