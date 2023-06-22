require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-ganache");

const HDWalletProvider = require("@truffle/hdwallet-provider");
/** @type import('hardhat/config').HardhatUserConfig */
/*module.exports = {
  solidity: "0.8.18",
};*/


/*module.exports = {
  solidity: {
    version: "0.8.18",
    settings: {
      viaIR: true,
    },
  },
};*/


/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  networks: {
    hardhat: {
      chainId: 1337, // Chain ID for the local Hardhat network
      mining: {
        mempool: {
          order: "fifo"
        }
      },
      accounts: {
        mnemonic: "ensure grow elegant beef release hungry merge attract afraid idea unit shine", // Mnemonic phrase for accounts
      },
    },
    ganache: {
      url: "http://localhost:7548", // Replace with the Ganache RPC endpoint
      chainId: 5777, // Chain ID for Ganache
      // accounts: [
      //   '0x6058faed44d237d1ab41f246901879a3474b4bd52432693ff25aab510dc55db8',
      //   '0xa7152b0059198eabd0aef916926559dea507ae3c4d4c366a15795c0cf078e293',
      // ],
    },
    aurora: {
      url: "https://aurora-testnet.infura.io/v3/1588460e10724097ad67f3d56891fbee",
      provider: () =>
        new HDWalletProvider(
          "ensure grow elegant beef release hungry merge attract afraid idea unit shine", 
          "https://aurora-testnet.infura.io/v3/1588460e10724097ad67f3d56891fbee"
        ),
        chainId: 1313161555, 
        accounts: {
          mnemonic: "ensure grow elegant beef release hungry merge attract afraid idea unit shine", // Mnemonic phrase for accounts
        },
      //network_id: 0x4e454153, // Aurora testnet ID
      gas: 10000000
    },
    /*aurora: {
      url: "https://aurora-testnet.infura.io/v3/1588460e10724097ad67f3d56891fbee", // Replace with the Aurora Infura endpoint
      chainId: 1313161555, // Chain ID for Aurora
      gasPrice: 1000000000, // Set the desired gas price
      accounts: {
        mnemonic: "ensure grow elegant beef release hungry merge attract afraid idea unit shine", // Mnemonic phrase for accounts
      },
    },*/
    goerli: {
      url: "https://eth-goerli.g.alchemy.com/v2/eFtzcdyW35EG_DZINaqrcSFWrvXR0YLz", // Replace with the Palm Infura endpoint
      chainId: 5, // Chain ID for Palm
      gasPrice: 1000000000, // Set the desired gas price
      accounts: {
        mnemonic: "ensure grow elegant beef release hungry merge attract afraid idea unit shine", // Mnemonic phrase for accounts
      },
    },
    palm: {
      url: "https://palm-testnet.infura.io/v3/1588460e10724097ad67f3d56891fbee", // Replace with the Palm Infura endpoint
      chainId: 11297108099, // Chain ID for Palm
      gasPrice: 1000000000, // Set the desired gas price
      accounts: {
        mnemonic: "ensure grow elegant beef release hungry merge attract afraid idea unit shine", // Mnemonic phrase for accounts
      },
    },
  },
  solidity: {
    version:  "0.8.18",
    settings: {
      viaIR: true,
      optimizer: {
        enabled: true,
        runs: 2000,
        details: {
          yul: true,
          yulDetails: {
            stackAllocation: true,
            optimizerSteps: "dhfoDgvulfnTUtnIf"
          }
        }
      }
    },
  },
};