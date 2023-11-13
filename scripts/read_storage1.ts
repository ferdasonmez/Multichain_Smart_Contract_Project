import { HARD_HAT_COMMUNITY_IMPLEMENTATION_ADDRESS, GOERLI_COMMUNITY_IMPLEMENTATION_ADDRESS, GANACHE_COMMUNITY_IMPLEMENTATION_ADDRESS, PALM_COMMUNITY_IMPLEMENTATION_ADDRESS, AURORA_COMMUNITY_IMPLEMENTATION_ADDRESS } from './constants';
import { HARD_HAT_RPC_URL, GANACHE_RPC_URL, GOERLI_RPC_URL, PALM_RPC_URL, AURORA_RPC_URL } from './constants';
import { HARD_HAT_WS_URL, GANACHE_WS_URL, GOERLI_WS_URL, PALM_WS_URL, AURORA_WS_URL } from './constants';
import { PRIVATE_KEY_FOR_DEFAULT_ACCOUNT, DEFAULT_ACCOUNT } from './constants';
import { ALCHEMY_KEY } from './constants';
import { COMMUNITY_ABI } from './abi_constants';
import Web3 from 'web3';
import util from 'web3-utils';
import abi  from 'web3-utils';
import { ethers, providers, Contract } from 'ethers';
import { getClient, EthClient } from '@ethercast/eth-jsonrpc-client';
import { HARD_HAT_STORAGE_1_INDEX, PALM_STORAGE_1_INDEX, AURORA_STORAGE_1_INDEX, GANACHE_STORAGE_1_INDEX, GOERLI_STORAGE_1_INDEX } from './constants';
import { HARD_HAT_STORAGE_2_INDEX, PALM_STORAGE_2_INDEX, AURORA_STORAGE_2_INDEX, GANACHE_STORAGE_2_INDEX, GOERLI_STORAGE_2_INDEX } from './constants';
import { HARD_HAT_STORAGE_3_INDEX, PALM_STORAGE_3_INDEX, AURORA_STORAGE_3_INDEX, GANACHE_STORAGE_3_INDEX, GOERLI_STORAGE_3_INDEX } from './constants';  
import { HARD_HAT_STORAGE_4_INDEX, PALM_STORAGE_4_INDEX, AURORA_STORAGE_4_INDEX, GANACHE_STORAGE_4_INDEX, GOERLI_STORAGE_4_INDEX } from './constants';  

// Setup
import { Network, Alchemy } from 'alchemy-sdk';
const WebSocket = require('websocket').w3cwebsocket;







let contract_address: string = '';
let web3: Web3;
let windowTitle: string = '';
let rpcUrl: string = '';
let wsUrl: string = '';
var settings = {};
var connected = false;

//let ALCHEMY_NETWORK_NAME: number = 0;

const selected_network = process.env.HARDHAT_NETWORK;
let owner_address: string = '';
owner_address = DEFAULT_ACCOUNT;
let storageIndex1 =  "";
let storageIndex2 =  "";
let storageIndex3 =  "";
let storageIndex4 =  "";
if (selected_network === "hardhat") {
  rpcUrl= HARD_HAT_RPC_URL; 
  wsUrl = HARD_HAT_WS_URL;
  storageIndex1 = HARD_HAT_STORAGE_1_INDEX;
  storageIndex2 = HARD_HAT_STORAGE_2_INDEX;
  storageIndex3 = HARD_HAT_STORAGE_3_INDEX;
  storageIndex4 = HARD_HAT_STORAGE_4_INDEX;
  settings = {
    apiKey: ALCHEMY_KEY,
    network: Network.ETH_MAINNET,
  };
  contract_address = HARD_HAT_COMMUNITY_IMPLEMENTATION_ADDRESS;
  web3 = new Web3(HARD_HAT_WS_URL);
  settings = {
    apiKey: ALCHEMY_KEY,
    network: Network.ETH_MAINNET,
  };
  windowTitle = 'Hardhat Community Event Listener';
}  else if (selected_network === "ganache") {
  rpcUrl= GANACHE_RPC_URL;
  wsUrl = GANACHE_WS_URL; 
  storageIndex1 = GANACHE_STORAGE_1_INDEX;
  storageIndex2 = GANACHE_STORAGE_2_INDEX;
  storageIndex3 = GANACHE_STORAGE_3_INDEX;
  storageIndex4 = GANACHE_STORAGE_4_INDEX;  
  settings = {
    apiKey: ALCHEMY_KEY,
    network: Network.ETH_MAINNET,
  };
  contract_address = GANACHE_COMMUNITY_IMPLEMENTATION_ADDRESS;
  web3 = new Web3(GANACHE_WS_URL);
  windowTitle = 'Ganache Community Event Listener';
} else if (selected_network === "goerli") {
  rpcUrl= GOERLI_RPC_URL; 
  wsUrl=GOERLI_WS_URL;
  storageIndex1 = GOERLI_STORAGE_1_INDEX;
  storageIndex2 = GOERLI_STORAGE_2_INDEX;
  storageIndex3 = GOERLI_STORAGE_3_INDEX;
  storageIndex4 = GOERLI_STORAGE_4_INDEX;  
  settings = {
    apiKey: ALCHEMY_KEY,
    network: Network.ETH_GOERLI,
  };
  contract_address = GOERLI_COMMUNITY_IMPLEMENTATION_ADDRESS;
  web3 = new Web3(GOERLI_WS_URL);
  windowTitle = 'Goerli Community Event Listener';
}else if (selected_network === "palm") {
  rpcUrl= PALM_RPC_URL; 
  wsUrl= PALM_WS_URL;
  storageIndex1 = PALM_STORAGE_1_INDEX;
  storageIndex2 = PALM_STORAGE_2_INDEX;
  storageIndex3 = PALM_STORAGE_3_INDEX;  
  storageIndex4 = PALM_STORAGE_4_INDEX; 
  settings = {
    apiKey: ALCHEMY_KEY,
    network: Network.ETH_MAINNET,
  };
  contract_address = PALM_COMMUNITY_IMPLEMENTATION_ADDRESS;
  web3 = new Web3(PALM_WS_URL);
  windowTitle = 'Palm Community Event Listener';
} else if (selected_network === "aurora") {
  rpcUrl= AURORA_RPC_URL; 
  wsUrl=AURORA_WS_URL;
  storageIndex1 = AURORA_STORAGE_1_INDEX;
  storageIndex2 = AURORA_STORAGE_2_INDEX;
  storageIndex3 = AURORA_STORAGE_3_INDEX; 
  storageIndex4 = AURORA_STORAGE_4_INDEX;   
  settings = {
    apiKey: ALCHEMY_KEY,
    network: Network.ETH_MAINNET,
  };

  contract_address = AURORA_COMMUNITY_IMPLEMENTATION_ADDRESS;
  web3 = new Web3(AURORA_WS_URL);
  windowTitle = 'Aurora Community Event Listener';
} else {
  throw new Error('Invalid chain selected');
}


const validatedClient = getClient(rpcUrl, true);
console.log("validatedClient", validatedClient);
process.title = windowTitle;


const wsClient = new WebSocket(wsUrl);
const alchemy = new Alchemy(settings);
/*const filter = {
  address: contract_address, // Replace with the desired contract address
  topics: [
    //"0x0d0142bd8e1660ba803946c35121ac959db54a10e5174b392f33d1913d1f9c0f",this was a known filter for goerli you may ignore it
    ethers.utils.id("MemberAdded(address, uint, string[])"), 
    ethers.utils.id("DenemeWithParam(string)"), 
    ethers.utils.id("OwnershipTransferred(address, address)"),
// Replace with the desired event name and its parameters
  ],
};*/

 /* const filterOptions = {
    address: contract_address,
    topics: [
      '0x0d0142bd8e1660ba803946c35121ac959db54a10e5174b392f33d1913d1f9c0f',
    ],
  };*/


  wsClient.onopen = () => {
    connected = true;
    query_storage();
    
};

wsClient.onclose = () => {
  console.log('WebSocket connection closed');
};

/*for (let index = 0; index < 30; index++){
  console.log(`[${index}]` + 
    web3.eth.getStorageAt(contract_address, index))
 }*/

wsClient.onmessage = async (message: { data: string; }) => {
  //console.log('Alınan mesaj:', message.data);
  const response = JSON.parse(message.data);
  if(response.result && response.result != "0x0000000000000000000000000000000000000000000000000000000000000000")
    console.log("Received message:", response);


  if (response.id === 10 && response.result) {
    var memberAccountsAddressListValue = response.result;
    var decodedParams = web3.eth.abi.decodeParameters(['uint16'], memberAccountsAddressListValue);
    var numberOfMembers = decodedParams['0'];
    console.log("Number of members read is ", numberOfMembers);
    query_accounts(numberOfMembers);
    query_chainIds(numberOfMembers);
    query_Tags(numberOfMembers);
    /*
    console.log("memberAccountsAddressListValue:", memberAccountsAddressListValue);
    let mainIndex = '000000000000000000000000000000000000000000000000000000000000000a';

    for (let index = 0; index < numberOfMembers; index++) {
      let newKey = web3.utils.sha3(PRIVATE_KEY_FOR_DEFAULT_ACCOUNT + mainIndex, { "encoding": "hex" });
      console.log(`[${mainIndex}]`);
      console.log("newKey: " + newKey);
      web3.eth.getStorageAt(contract_address, newKey).then((storageValue) => {
        console.log("Value (hex): " + storageValue);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
      let decimalMainIndex = parseInt(mainIndex, 16);
  
      // Increment the decimal value by 1
      decimalMainIndex += 1;
      
      // Convert the decimal value back to hexadecimal
      mainIndex = decimalMainIndex.toString(16).padStart(64, '0');
    }*/
  }//if id == 10

  /*if (response.id === 11 && response.result) {
    var memberAccountsChainsIdsListValue = response.result;
    var decodedParams = web3.eth.abi.decodeParameters(['uint16'], memberAccountsChainsIdsListValue);
    var numberOfMembers = decodedParams['0'];
    console.log("Number of members read is ", numberOfMembers);

    console.log("memberAccountsChainsIdsListValue:", memberAccountsChainsIdsListValue);
    let mainIndex = '000000000000000000000000000000000000000000000000000000000000000b';

    for (let index = 0; index < numberOfMembers; index++) {
      let newKey = web3.utils.sha3(PRIVATE_KEY_FOR_DEFAULT_ACCOUNT + mainIndex, { "encoding": "hex" });
      console.log(`[${mainIndex}]`);
      console.log("newKey: " + newKey);
      web3.eth.getStorageAt(contract_address, newKey).then((storageValue) => {
        console.log("Value (hex): " + storageValue);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
      let decimalMainIndex = parseInt(mainIndex, 16);
  
      // Increment the decimal value by 1
      decimalMainIndex += 1;
      
      // Convert the decimal value back to hexadecimal
      mainIndex = decimalMainIndex.toString(16).padStart(64, '0');
    }
  }//if id == 11


  if (response.id === 12 && response.result) {
    var memberTagsListValue = response.result;
    var decodedParams = web3.eth.abi.decodeParameters(['uint16'], memberTagsListValue);
    var numberOfMembers = decodedParams['0'];
    

    console.log("memberTagsListValue:", memberTagsListValue);
    let mainIndex = '000000000000000000000000000000000000000000000000000000000000000c';

    for (let index = 0; index < numberOfMembers; index++) {
      let newKey = web3.utils.sha3(PRIVATE_KEY_FOR_DEFAULT_ACCOUNT + mainIndex, { "encoding": "hex" });
      console.log(`[${mainIndex}]`);
      console.log("newKey: " + newKey);

 

      web3.eth.getStorageAt(contract_address, newKey).then((storageValue) => {
        console.log("Value (hex): " + storageValue);
      })
      .catch((error) => {
        console.error("Error:", error);
      });

      let decimalMainIndex = parseInt(mainIndex, 16);
  
      // Increment the decimal value by 1
      decimalMainIndex += 1;
      
      // Convert the decimal value back to hexadecimal
      mainIndex = decimalMainIndex.toString(16).padStart(64, '0');
    }
  }//if id == 12
 */
  if (response.id === 13 && response.result) {
    var chainWeightsMapAdressValue = response.result;
    var decodedParams = web3.eth.abi.decodeParameters(['uint16'], chainWeightsMapAdressValue);
    var numberOfMapItems = decodedParams['0'];
    console.log("Number of chainWeights map items is ", numberOfMapItems);
    query_chainWeights(numberOfMapItems);

  }
};

wsClient.onclose = () => {
  console.log('WebSocket sunucusundan bağlantı kesildi');
};

wsClient.onerror = (error: any) => {
  console.error('WebSocket error:', error);
};

const main = async () => {
  const interval = 100000; // Delay in milliseconds (e.g., 5000ms = 5 seconds)

  for (;;) {
    /*try {
      let logs = await alchemy.core.getLogs({
        // fromBlock: "0",
        // toBlock: "10",
        address: contract_address,
        topics: [
          web3.utils.keccak256('MemberAdded(address, uint, string[])'), // Example event name and parameters
        ],
      });

      console.log("LOGS:", logs);

      // Check if the logs contain the desired event
      if (logs.length > 0) {
        // Event found, break out of the loop
        break;
      }
    } catch (error) {
      console.error("Error querying logs:", error);
    }*/
    if (connected){
      query_storage();
    }

    await delay(interval); // Wait for the specified interval before the next iteration
  }

  // Event found, continue with further processing
  processLogs();
};


const query_accounts = (numberofAccounts: number) => {
  console.log("QUERYING ACCOUNTS");
  console.log("storageIndex1:", storageIndex1);
  let queryIndex = storageIndex1;
  let queryId = 6000;
  for (let index = 0; index < numberofAccounts; index++){
    const storageDataQueryA = {
      "jsonrpc":"2.0", 
       "method": "eth_getStorageAt", 
       "params": [contract_address, queryIndex, "latest"], "id": queryId}
  
      wsClient.send(JSON.stringify(storageDataQueryA));
      console.log(queryId, " ", queryIndex);
      queryId++;
      queryIndex = hexIncrement(queryIndex, 1);
    }
};

const query_chainIds = (numberofAccounts: number) => {
  console.log("QUERYING CHAIN IDS");
  console.log("storageIndex2:", storageIndex2);
  let queryIndex = storageIndex2;
  let queryId = 7000;
  for (let index = 0; index < numberofAccounts; index++){
    const storageDataQueryA = {
      "jsonrpc":"2.0", 
       "method": "eth_getStorageAt", 
       "params": [contract_address, queryIndex, "latest"], "id": queryId}
  
      wsClient.send(JSON.stringify(storageDataQueryA));
      console.log(queryId, " ", queryIndex);
      queryId++;
      queryIndex = hexIncrement(queryIndex, 1);
    }
};


const query_Tags = (numberofAccounts: number) => {
  console.log("QUERYING TAGS");
  console.log("storageIndex3", storageIndex3);
  let queryIndex = storageIndex3;
  let queryId = 8000;
  for (let index = 0; index < numberofAccounts; index++){
    const storageDataQueryA = {
      "jsonrpc":"2.0", 
       "method": "eth_getStorageAt", 
       "params": [contract_address, queryIndex, "latest"], "id": queryId}
  
      wsClient.send(JSON.stringify(storageDataQueryA));
      console.log(queryId, " ", queryIndex);



      let newKey = web3.utils.sha3(PRIVATE_KEY_FOR_DEFAULT_ACCOUNT + queryIndex, { "encoding": "hex" });

      console.log("newKey: " + newKey);
      web3.eth.getStorageAt(contract_address, newKey).then((storageValue) => {
        console.log("Value (hex): " + storageValue);
      })
      .catch((error) => {
        console.error("Error:", error);
      });

      queryId++;
      queryIndex = hexIncrement(queryIndex, 1);
    }
};

const query_chainWeights = (numberofMaps: number) => {
  console.log("QUERYING CHAIN IDS");
  console.log("storageIndex4:", storageIndex4);
  let queryIndex = storageIndex4;
  let queryId = 9000;
  for (let index = 0; index < numberofMaps; index++){
    const storageDataQueryA = {
      "jsonrpc":"2.0", 
       "method": "eth_getStorageAt", 
       "params": [contract_address, queryIndex, "latest"], "id": queryId}
  
      wsClient.send(JSON.stringify(storageDataQueryA));
      console.log(queryId, " ", queryIndex);
      queryId++;
      queryIndex = hexIncrement(queryIndex, 1);
    }
};
function hexIncrement(hexNumber: string, incrementBy: number) {
  // Remove "0x" prefix if present
  hexNumber = hexNumber.startsWith('0x') ? hexNumber.slice(2) : hexNumber;

  // Convert hex to BigInt
  let decimalNumber = BigInt('0x' + hexNumber);

  // Increment the decimal number
  decimalNumber += BigInt(incrementBy);

  // Convert back to hex
  let incrementedHex = decimalNumber.toString(16);

  // Add "0x" prefix and pad with zeros to the original length if needed
  while (incrementedHex.length < hexNumber.length) {
    incrementedHex = '0' + incrementedHex;
  }
  incrementedHex = '0x' + incrementedHex;

  return incrementedHex;
}

const query_storage = () => {


  web3.eth.getStorageAt(contract_address, "0x0175b7a638427703f0dbe7bb9bbf987a2551717b34e79f33b5b1008d1fa01db9")

/*
  const storageDataQueryA = {
    "jsonrpc":"2.0", 
     "method": "eth_getStorageAt", 
     "params": [contract_address, "0x0175b7a638427703f0dbe7bb9bbf987a2551717b34e79f33b5b1008d1fa01db9", "latest"], "id": 6000}

    wsClient.send(JSON.stringify(storageDataQueryA));

    const storageDataQueryB = {
      "jsonrpc":"2.0", 
       "method": "eth_getStorageAt", 
       "params": [contract_address, "0x0175b7a638427703f0dbe7bb9bbf987a2551717b34e79f33b5b1008d1fa01dba", "latest"], "id": 6001}
  
      wsClient.send(JSON.stringify(storageDataQueryB));
  
      const storageDataQueryC = {
        "jsonrpc":"2.0", 
         "method": "eth_getStorageAt", 
         "params": [contract_address, "0x0175b7a638427703f0dbe7bb9bbf987a2551717b34e79f33b5b1008d1fa01dba", "latest"], "id": 6001}
    
        wsClient.send(JSON.stringify(storageDataQueryB));
    
  const storageDataQuery1 = {
    "jsonrpc":"2.0", 
     "method": "eth_getStorageAt", 
     "params": [contract_address, "0x0", "latest"], "id": 0}

    wsClient.send(JSON.stringify(storageDataQuery1));

*/
/*
    var key1 = DEFAULT_ACCOUNT + "0000000000000000000000000000000000000000000000000000000000000001";
      
    const storageDataQuery2 = {
        "jsonrpc":"2.0", 
         "method": "eth_getStorageAt", 
         "params": [contract_address, "0x1", "latest"], "id": 1
    }
    
    wsClient.send(JSON.stringify(storageDataQuery2));
    var key2 = DEFAULT_ACCOUNT + "0000000000000000000000000000000000000000000000000000000000000002";
  
    const storageDataQuery3 = {
      "jsonrpc":"2.0", 
        "method": "eth_getStorageAt", 
        "params": [contract_address, "0x2", "latest"], "id": 2
    }//communityName
      
    wsClient.send(JSON.stringify(storageDataQuery3));

    var key3 = DEFAULT_ACCOUNT + "0000000000000000000000000000000000000000000000000000000000000003";
      
    const storageDataQuery4 = {
      "jsonrpc":"2.0", 
        "method": "eth_getStorageAt", 
        "params": [contract_address, "0x3", "latest"], "id": 3}
        
    wsClient.send(JSON.stringify(storageDataQuery4));
    var key4 = DEFAULT_ACCOUNT + "0000000000000000000000000000000000000000000000000000000000000004";
      
    const storageDataQuery5 = {
      "jsonrpc":"2.0", 
        "method": "eth_getStorageAt", 
        "params": [contract_address, "0x4", "latest"], "id": 4}
        
    wsClient.send(JSON.stringify(storageDataQuery5));


    const storageDataQuery6 = {
      "jsonrpc":"2.0", 
        "method": "eth_getStorageAt", 
        "params": [contract_address, "0x5", "latest"], "id": 5}
        
    wsClient.send(JSON.stringify(storageDataQuery6));

    const storageDataQuery7 = {
      "jsonrpc":"2.0", 
        "method": "eth_getStorageAt", 
        "params": [contract_address, "0x6", "latest"], "id": 6}
        
    wsClient.send(JSON.stringify(storageDataQuery7));

    const storageDataQuery8 = {
      "jsonrpc":"2.0", 
        "method": "eth_getStorageAt", 
        "params": [contract_address, "0x7", "latest"], "id": 7}//denemeString
        
    wsClient.send(JSON.stringify(storageDataQuery8));

    const storageDataQuery9 = {
      "jsonrpc":"2.0", 
        "method": "eth_getStorageAt", 
        "params": [contract_address, "0x8", "latest"], "id": 8}//decisionManagementProxy
        
    wsClient.send(JSON.stringify(storageDataQuery9));

    const storageDataQuery10 = {
      "jsonrpc":"2.0", 
        "method": "eth_getStorageAt", 
        "params": [contract_address, "0x9", "latest"], "id": 9}//utilityProxyAddress
        
    wsClient.send(JSON.stringify(storageDataQuery10));
*/
    const storageDataQuery11 = {
      "jsonrpc":"2.0", 
        "method": "eth_getStorageAt", 
        "params": [contract_address, "0xA", "latest"], "id": 10}//
        
    wsClient.send(JSON.stringify(storageDataQuery11));

    const storageDataQuery12 = {
      "jsonrpc":"2.0", 
        "method": "eth_getStorageAt", 
        "params": [contract_address, "0xB", "latest"], "id": 11}//
        
    wsClient.send(JSON.stringify(storageDataQuery12));

    const storageDataQuery13= {
      "jsonrpc":"2.0", 
        "method": "eth_getStorageAt", 
        "params": [contract_address, "0xC", "latest"], "id": 12}//
        
    wsClient.send(JSON.stringify(storageDataQuery13));

    const storageDataQuery14= {
      "jsonrpc":"2.0", 
        "method": "eth_getStorageAt", 
        "params": [contract_address, "0xD", "latest"], "id": 13}//
        
    wsClient.send(JSON.stringify(storageDataQuery14));


}

const processLogs = () => {
  // Process the logs or call the function to create an event
  // Implement your logic here
  console.log("Processing logs");
};

const delay = (ms: number | undefined) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const run = async () => {
  try {
      const c = await inspector.compile(src, target, /*'v0.8.2+commit.661d1103'*/);
      console.log(c.listVars());
      console.log(c.storageLayout);
  
      const results = await c.getVars(address);
  
      console.log(results);
      console.log(results[4].decoded.value);
      console.log(results[7].type.members);
      console.log(results[7].decoded.value);
  
      console.log("=======");
      console.log(await summarize(results));
  } catch(e) {
      console.error(e);
  }
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

runMain();