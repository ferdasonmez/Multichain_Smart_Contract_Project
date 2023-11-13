import { ethers } from 'hardhat';
import { UtilityFactory, UtilityProxyFactory, UtilityProxy } from './typechain';
import { COMMUNITY_NAME, HARD_HAT_UTILITY_PROXY_ADDRESS, HARD_HAT_DECISION_MANAGEMENT_PROXY_ADDRESS, GANACHE_UTILITY_PROXY_ADDRESS, GANACHE_DECISION_MANAGEMENT_PROXY_ADDRESS, GOERLI_UTILITY_PROXY_ADDRESS, GOERLI_DECISION_MANAGEMENT_PROXY_ADDRESS, PALM_UTILITY_PROXY_ADDRESS, PALM_DECISION_MANAGEMENT_PROXY_ADDRESS, AURORA_UTILITY_PROXY_ADDRESS, AURORA_DECISION_MANAGEMENT_PROXY_ADDRESS } from './constants';
import { SAMPLE_ADDRESS1, SAMPLE_ADDRESS2 } from './constants';
import { HARD_HAT_STORAGE_1_INDEX, PALM_STORAGE_1_INDEX, AURORA_STORAGE_1_INDEX, GANACHE_STORAGE_1_INDEX, GOERLI_STORAGE_1_INDEX } from './constants';
import { HARD_HAT_STORAGE_2_INDEX, PALM_STORAGE_2_INDEX, AURORA_STORAGE_2_INDEX, GANACHE_STORAGE_2_INDEX, GOERLI_STORAGE_2_INDEX } from './constants';
import { HARD_HAT_STORAGE_3_INDEX, PALM_STORAGE_3_INDEX, AURORA_STORAGE_3_INDEX, GANACHE_STORAGE_3_INDEX, GOERLI_STORAGE_3_INDEX } from './constants';  



import { task } from "hardhat/config";


const fs = require('fs').promises;


function updateConstantsJson(selected_network, community) {
  return new Promise(async (resolve, reject) => {
    //const constantsJsonPath = '../constants.json';
    const constantsJsonPath = 'C:/Users/aax374/Dropbox/England_2022/Work Imperial/Projects/Multi-chain/scripts/constants.json';


    try {
      // Read the JSON file
      const jsonString = await fs.readFile(constantsJsonPath, 'utf8');
      const constantsJson = JSON.parse(jsonString);

      // Update the JSON object based on the selected network
      if (selected_network === 'hardhat') {
        constantsJson.HARD_HAT_COMMUNITY_IMPLEMENTATION_ADDRESS = community.address;
      } else if (selected_network === 'ganache') {
        constantsJson.GANACHE_COMMUNITY_IMPLEMENTATION_ADDRESS = community.address;
      } else if (selected_network === 'palm') {
        constantsJson.PALM_COMMUNITY_IMPLEMENTATION_ADDRESS = community.address;
      } else if (selected_network === 'goerli') {
        constantsJson.GOERLI_COMMUNITY_IMPLEMENTATION_ADDRESS = community.address;
      } else if (selected_network === 'aurora') {
        constantsJson.AURORA_COMMUNITY_IMPLEMENTATION_ADDRESS = community.address;

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
    console.log(process.env.HARDHAT_NETWORK);

    var selected_network : string = process.env.HARDHAT_NETWORK;
    //require(selected_network.length > 0, 'No network parameter provided.');
    
    // Access command line arguments
    const args = process.argv.slice(2);

    console.log(`Deploying contracts on ${selected_network} network with the account: ${deployer.address}`);

    let utilityProxyAddress = '';
    let decisionManagementProxyAddress = '';
    let chainID =  process.env.HARDHAT_CHAIN_ID;
    let chainName =  process.env.HARDHAT_CHAIN_NAME;
    let storageIndex1 =  "";
    let storageIndex2 =  "";
    let storageIndex3 =  "";
    // Set the proxy addresses based on the network
    if (selected_network === 'hardhat') {
      utilityProxyAddress = HARD_HAT_UTILITY_PROXY_ADDRESS;
      decisionManagementProxyAddress = HARD_HAT_DECISION_MANAGEMENT_PROXY_ADDRESS;
      chainID =  process.env.HARDHAT_CHAIN_ID;
      chainName =  process.env.HARDHAT_CHAIN_NAME;
    } else if (selected_network === 'ganache') {
      utilityProxyAddress = GANACHE_UTILITY_PROXY_ADDRESS;
      decisionManagementProxyAddress = GANACHE_DECISION_MANAGEMENT_PROXY_ADDRESS;
      chainID =  process.env.GANACHE_CHAIN_ID;
      chainName =  process.env.GANACHE_CHAIN_NAME;
    } else if (selected_network === 'palm') {
      utilityProxyAddress = PALM_UTILITY_PROXY_ADDRESS;
      decisionManagementProxyAddress = PALM_DECISION_MANAGEMENT_PROXY_ADDRESS;
      chainID =  process.env.PALM_CHAIN_ID;
      chainName =  process.env.PALM_CHAIN_NAME;
    } else if (selected_network === 'goerli') {
      utilityProxyAddress = GOERLI_UTILITY_PROXY_ADDRESS;
      decisionManagementProxyAddress = GOERLI_DECISION_MANAGEMENT_PROXY_ADDRESS;
      chainID =  process.env.GOERLI_CHAIN_ID;
      chainName =  process.env.GOERLI_CHAIN_NAME;
    } else if (selected_network === 'aurora') {
      utilityProxyAddress = AURORA_UTILITY_PROXY_ADDRESS;
      decisionManagementProxyAddress = AURORA_DECISION_MANAGEMENT_PROXY_ADDRESS;
      chainID =  process.env.AURORA_CHAIN_ID;
      chainName =  process.env.AURORA_CHAIN_NAME;
    } else {
      throw new Error('Invalid network selected');
    }

    console.log('Utility Proxy Address:', utilityProxyAddress);
    console.log('Decision Management Proxy Address:', decisionManagementProxyAddress);

    const communityFactory = (await ethers.getContractFactory(
      'MultiChainCommunity'
    )) as UtilityFactory;
    console.log('Sample address 1 is ', SAMPLE_ADDRESS1);
    console.log('Sample address 2 is ', SAMPLE_ADDRESS2);
    const community = await communityFactory.deploy(1, COMMUNITY_NAME, utilityProxyAddress, decisionManagementProxyAddress, ethers.constants.AddressZero, 0, ["tag4", "tag5", "tag6"], "tag4, tag5, tag6", chainID, chainName, SAMPLE_ADDRESS1, SAMPLE_ADDRESS2);

    console.log('Community contract address for community ' + COMMUNITY_NAME + ':', community.address);
    try {
      await updateConstantsJson(selected_network, community);
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
