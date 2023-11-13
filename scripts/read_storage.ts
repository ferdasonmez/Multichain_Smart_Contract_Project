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
if (selected_network === "hardhat") {
  rpcUrl= HARD_HAT_RPC_URL; 
  wsUrl = HARD_HAT_WS_URL;

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
  settings = {
    apiKey: ALCHEMY_KEY,
    network: Network.ETH_GOERLI,
  };
  contract_address = GOERLI_COMMUNITY_IMPLEMENTATION_ADDRESS;
  web3 = new Web3(GOERLI_WS_URL);
  windowTitle = 'Goerli Community Event Listener';
}else if (selected_network === "palm") {
  rpcUrl= PALM_RPC_URL; 
  wsUrl= AURORA_WS_URL;
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
const filter = {
  address: contract_address, // Replace with the desired contract address
  topics: [
    //"0x0d0142bd8e1660ba803946c35121ac959db54a10e5174b392f33d1913d1f9c0f",this was a known filter for goerli you may ignore it
    ethers.utils.id("MemberAdded(address, uint, string[])"), 
    ethers.utils.id("DenemeWithParam(string)"), 
    ethers.utils.id("OwnershipTransferred(address, address)"),
// Replace with the desired event name and its parameters
  ],
};

  const filterOptions = {
    address: contract_address,
    topics: [
      '0x0d0142bd8e1660ba803946c35121ac959db54a10e5174b392f33d1913d1f9c0f',
    ],
  };


  wsClient.onopen = () => {
    connected = true;
    /*const getFilterIdRequest = {
      jsonrpc: "2.0",
      method: "eth_newFilter",
      params: [filter],
      id: 1000,
    };
    wsClient.send(JSON.stringify(getFilterIdRequest));
    console.log("WSClient Sent getFilterIdRequest:", getFilterIdRequest);
  */
    for (let index = 1; index < 5; index++) {
      let hexIndex = index.toString(16).padStart(64, "0"); // Convert index to hexadecimal
      let newKey = web3.utils.sha3(PRIVATE_KEY_FOR_DEFAULT_ACCOUNT + hexIndex, { "encoding": "hex" });
      console.log(`[${index}]`);
      console.log("newKey: " + newKey);
      console.log("Value (hex): " + web3.eth.getStorageAt(contract_address, newKey));
      //console.log("Value (ASCII): " + web3.utils.toAscii(web3.eth.getStorageAt(contract_address, newKey)));
    }


    
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

  /*if (response.id === 1000 && response.result) {
    const filterId = response.result;
    console.log("Filter ID:", filterId);

    const getLogsRequest = {
      jsonrpc: "2.0",
      fromBlock: 0,
      toBlock: 'latest',
      method: "eth_getFilterLogs",
      params: [filterId],
      id: 2000,
    };
    wsClient.send(JSON.stringify(getLogsRequest));
    console.log("WSClient Sent getLogsRequest:", getLogsRequest);
    const payload = {
      "jsonrpc": "2.0",
      "method": "net_listening",
      "params": [],
      "id": 3000
  }*/
  /*wsClient.send(JSON.stringify(payload));
  //const blockNumber = await validatedClient.eth_blockNumber();
  //console.log(`blockNumber is ${blockNumber}`);
  (await validatedClient).eth_getLogs(filterId)
  .then(logs => {
    console.log(`Logs are ${logs}`);
  })
  .catch(error => {
    console.log(`Error ${error}`);
  });


  }*/


  if (response.id === 1 && response.result) {
    var communityDataStorageId = response.result;
    console.log("communityDataStorageId:", communityDataStorageId);
    let index = '0000000000000000000000000000000000000000000000000000000000000000';
    //let newKey =  web3.utils.sha3(communityDataStorageId + index, {"encoding":"hex"})
    //let newKey =  web3.utils.sha3(communityDataStorageId + 1)
    let newKey = web3.utils.sha3(communityDataStorageId + index)
    let getDetailedStorageRequest = {
      jsonrpc: "2.0",
      method: "eth_getStorageAt",
      params: [contract_address, newKey, "latest"],
      id: 5000,
    };
    wsClient.send(JSON.stringify(getDetailedStorageRequest));

    communityDataStorageId = response.result;
    console.log("communityDataStorageId:", communityDataStorageId);
    index = '0000000000000000000000000000000000000000000000000000000000000001';
    //let newKey =  web3.utils.sha3(communityDataStorageId + index, {"encoding":"hex"})
    //let newKey =  web3.utils.sha3(communityDataStorageId + 1)
    newKey = web3.utils.sha3(communityDataStorageId + index)
    getDetailedStorageRequest = {
      jsonrpc: "2.0",
      method: "eth_getStorageAt",
      params: [contract_address, newKey, "latest"],
      id: 5001,
    };
    wsClient.send(JSON.stringify(getDetailedStorageRequest));

    index = '0000000000000000000000000000000000000000000000000000000000000002';
    newKey =  web3.utils.sha3(communityDataStorageId + index)
    
    newKey =  web3.utils.sha3(communityDataStorageId + 2)
    newKey = web3.utils.keccak256(communityDataStorageId + index);
    getDetailedStorageRequest = {
      jsonrpc: "2.0",
      method: "eth_getStorageAt",
      params: [contract_address, newKey, "latest"],
      id: 5002,
    };
    wsClient.send(JSON.stringify(getDetailedStorageRequest));


    index = '0000000000000000000000000000000000000000000000000000000000000003';
    newKey =  web3.utils.sha3(communityDataStorageId + index)
    newKey =  web3.utils.sha3(communityDataStorageId + 3)
    newKey = web3.utils.keccak256(communityDataStorageId + index);
    getDetailedStorageRequest = {
      jsonrpc: "2.0",
      method: "eth_getStorageAt",
      params: [contract_address, newKey, "latest"],
      id: 5003,
    };
    wsClient.send(JSON.stringify(getDetailedStorageRequest));


    
    index = '0000000000000000000000000000000000000000000000000000000000000004';
    newKey =  web3.utils.sha3(communityDataStorageId + index)
    newKey =  web3.utils.sha3(communityDataStorageId + 4)
    newKey = web3.utils.keccak256(communityDataStorageId + index);
    getDetailedStorageRequest = {
      jsonrpc: "2.0",
      method: "eth_getStorageAt",
      params: [contract_address, newKey, "latest"],
      id: 5004,
    };
    wsClient.send(JSON.stringify(getDetailedStorageRequest));
   //console.log("WSClient Sent getDetailedStorageRequest:", getDetailedStorageRequest);

  }
  
};

wsClient.onclose = () => {
  console.log('WebSocket sunucusundan bağlantı kesildi');
};

wsClient.onerror = (error: any) => {
  console.error('WebSocket error:', error);
};

const main = async () => {
  const interval = 10000; // Delay in milliseconds (e.g., 5000ms = 5 seconds)

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

const query_storage = () => {
  const storageDataQuery1 = {
    "jsonrpc":"2.0", 
     "method": "eth_getStorageAt", 
     "params": [contract_address, "0x0", "latest"], "id": 0}

    wsClient.send(JSON.stringify(storageDataQuery1));


    //keccack(LeftPad32(key, 0), LeftPad32(map position, 0))
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


    //const contractAddress = '0x...'; // Replace with your contract address
    const startSlot = 95;//
    const endSlot = 100;

  for (let slot = startSlot; slot <= endSlot; slot++) {
    const slotHex = '0x' + slot.toString(16).padStart(64, '0'); // Convert the slot number to a 64-character hex string
    //const slotHex = '0x' + slot.toString(16); 
    //const slotHex = '0x000000000000000000000000000000000000000000000000000000000000005f';
    const storageDataQuery = {
      jsonrpc: '2.0',
      method: 'eth_getStorageAt',
      params: [contract_address, slotHex, 'latest'],
      id: slot
    };

    wsClient.send(JSON.stringify(storageDataQuery));
  }
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