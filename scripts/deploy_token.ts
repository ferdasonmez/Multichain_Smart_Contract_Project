import { ethers } from 'hardhat';
import * as Constants from './constants';
import { UtilityFactory, UtilityProxyFactory, UtilityProxy } from './typechain';
//import * as Constants from './constants';
import { HARD_HAT_TOKEN_IMPLEMENTATION_ADDRESS, GANACHE_TOKEN_IMPLEMENTATION_ADDRESS, PALM_TOKEN_IMPLEMENTATION_ADDRESS, GOERLI_TOKEN_IMPLEMENTATION_ADDRESS,  AURORA_TOKEN_IMPLEMENTATION_ADDRESS } from './constants';
require('dotenv').config(); 
const fs = require('fs').promises;


function updateConstantsJson(selected_network, lydiaTokenImpl) {
  return new Promise(async (resolve, reject) => {
    //const constantsJsonPath = '../constants.json';
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
    const [deployer] = await ethers.getSigners();

    let selected_network: string = process.env.HARDHAT_NETWORK || '';
    //require(selected_network.length > 0, 'No network parameter provided.');
    
    console.log(selected_network);
    console.log(deployer.address);    
    console.log(`Deploying contracts on ${selected_network} network with the account: ${deployer.address}`);


    const utilityFactory = (await ethers.getContractFactory(
      'LydiaTokenImpl'
    )) as UtilityFactory;

    const lydiaTokenImpl = await utilityFactory.deploy({ gasLimit: 5000000 });

    console.log('LydiaTokenImpl contract address:', lydiaTokenImpl.address);


    try {
      await updateConstantsJson(selected_network, lydiaTokenImpl);
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
