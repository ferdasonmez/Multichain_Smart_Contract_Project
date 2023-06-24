import { ethers } from 'hardhat';
import { UtilityFactory, UtilityProxyFactory, UtilityProxy } from './typechain';
import { HARD_HAT_UTILITY_PROXY_ADDRESS, GOERLI_UTILITY_PROXY_ADDRESS, GANACHE_UTILITY_PROXY_ADDRESS, PALM_UTILITY_PROXY_ADDRESS, AURORA_UTILITY_PROXY_ADDRESS } from '../constants';

const fs = require('fs').promises;


function updateConstantsJson(selected_network, decisionManagementProxy, decisionManagement) {
  return new Promise(async (resolve, reject) => {
    //const constantsJsonPath = '../constants.json';
    const constantsJsonPath = 'C:/Users/aax374/Dropbox/England_2022/Work Imperial/Projects/Multi-chain/scripts/constants.json';


    try {
      // Read the JSON file
      const jsonString = await fs.readFile(constantsJsonPath, 'utf8');
      const constantsJson = JSON.parse(jsonString);

      // Update the JSON object based on the selected network
      if (selected_network === 'hardhat') {
        constantsJson.HARD_HAT_DECISION_MANAGEMENT_PROXY_ADDRESS = decisionManagementProxy.address;
        constantsJson.HARD_HAT_DECISION_MANAGEMENT_IMPLEMENTATION_ADDRESS = decisionManagement.address;
      } else if (selected_network === 'ganache') {
        constantsJson.GANACHE_DECISION_MANAGEMENT_PROXY_ADDRESS = decisionManagementProxy.address;
        constantsJson.GANACHE_DECISION_MANAGEMENT_IMPLEMENTATION_ADDRESS = decisionManagement.address;
      } else if (selected_network === 'palm') {
        constantsJson.PALM_DECISION_MANAGEMENT_PROXY_ADDRESS = decisionManagementProxy.address;
        constantsJson.PALM_DECISION_MANAGEMENT_IMPLEMENTATION_ADDRESS = decisionManagement.address;
      } else if (selected_network === 'goerli') {
        constantsJson.GOERLI_DECISION_MANAGEMENT_PROXY_ADDRESS = decisionManagementProxy.address;
        constantsJson.GOERLI_DECISION_MANAGEMENT_IMPLEMENTATION_ADDRESS = decisionManagement.address;
      } else if (selected_network === 'aurora') {
        constantsJson.AURORA_DECISION_MANAGEMENT_PROXY_ADDRESS = decisionManagementProxy.address;
        constantsJson.AURORA_DECISION_MANAGEMENT_IMPLEMENTATION_ADDRESS = decisionManagement.address;
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

  let selected_network:string = process.env.HARDHAT_NETWORK;
  //require(selected_network.length > 0, 'No network parameter provided.');
  
  console.log(selected_network);
  // Check if a network parameter is provided

    console.log(`Deploying contracts on ${selected_network} network with the account: ${deployer.address}`);

    let utilityProxyAddress = '';

    // Set the proxy address based on the network
    if (selected_network === 'hardhat') {
      utilityProxyAddress = HARD_HAT_UTILITY_PROXY_ADDRESS;
    } else if (selected_network === 'ganache') {
      utilityProxyAddress = GANACHE_UTILITY_PROXY_ADDRESS;
    } else if (selected_network === 'goerli') {
      utilityProxyAddress = GOERLI_UTILITY_PROXY_ADDRESS;
    }else if (selected_network === 'palm') {
      utilityProxyAddress = PALM_UTILITY_PROXY_ADDRESS;
    } else if (selected_network === 'aurora') {
      utilityProxyAddress = AURORA_UTILITY_PROXY_ADDRESS;
    } else {
      throw new Error('Invalid network selected');
    }

    console.log('Utility Proxy Address:', utilityProxyAddress);

    const decisionManagementFactory = (await ethers.getContractFactory(
      'DecisionManagementImpl'
    )) as UtilityFactory;
    const decisionManagement = await decisionManagementFactory.deploy(utilityProxyAddress);

    console.log('DecisionManagementImpl contract address:', decisionManagement.address);

    const decisionManagementProxyFactory = (await ethers.getContractFactory(
      'DecisionManagementProxy'
    )) as UtilityProxyFactory;
    const decisionManagementProxy = await decisionManagementProxyFactory.deploy();

    console.log('DecisionManagementProxy contract address:', decisionManagementProxy.address);

    await decisionManagementProxy.setImplementation(decisionManagement.address);

    console.log('DecisionManagementProxy implementation set to DecisionManagementImpl');
    try {
      await updateConstantsJson(selected_network, decisionManagementProxy, decisionManagement);
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
