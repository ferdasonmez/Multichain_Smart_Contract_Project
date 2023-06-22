

# Sample Hardhat Project
npm init --for new package json
npm cache clean --clean cache
npm cache clean --force 
npm install --save-dev ethers@^5.0.0
npx hardhat node --show-stack-traces // run node
npm install --save-dev node-fetch@2
For openzeppelin installation
```shell
npm install --save-dev @openzeppelin/contracts
npm install --save-dev @openzeppelin/contracts-upgradeable
npm install --save-dev @openzeppelin/truffle-upgrades
```
For hardhat installation
```shell

npm install --save-dev hardhat
npm install --save-dev @nomicfoundation/hardhat-toolbox
npm install --save-dev @nomiclabs/hardhat-ethers
```
For ipfs installation
```shell
npm install --save-dev ipfs-http-client
npm install --save-dev it-to-buffer
```

For hardhat ipfs installation
```shell
npm install hardhat-IPFS ipfs
npm install --save ipfs-core-utils
```

For typescript
```shell
npm install --save-dev typescript
npm install --save-dev ts-node

openzeppelin
npm install --save-dev @openzeppelin/contracts
npm install --save-dev @openzeppelin/contracts-upgradeable
npm install --save-dev @openzeppelin/truffle-upgrades
```
Other Necessary
npm i --save-dev @types/node
npm install @hop-protocol/sdk
npm install @hop-protocol/core
npm install --save-dev @truffle/codec
npm install --save-dev typechain
npm install --save-dev prompt-sync
npm install --save-dev web3-providers-ws
npm install --save-dev @nomiclabs/hardhat-ganache
npm install --save-dev stdio
npm install  --save-dev  alchemy-sdk
npm install --save-dev --global cross-env
npm install --save-dev child_process
npm install --save-dev websocket
Try running some of the following tasks:
```shell
npx hardhat # get a quick sense of what's available and what's going on
npx hardhat compile  #compile
npx hardhat node #deploy

npx hardhat run --network localhost scripts/ipfs/configure_ipfs.ts #configure ipfs
npx hardhat run --network localhost scripts/utility/deploy_utility.ts #deploy utilty
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test

npx hardhat run scripts/deploy.ts
hardhat compiler
npm i @matterlabs/hardhat-zksync-solc
```
Deployment In Order

Deploy to hardhat
npx hardhat run --network hardhat .\scripts\utility\deploy_utility.ts
npx hardhat run --network hardhat .\scripts\genericMultiChainDecisionManagement\deploy_decision_management.ts
npx hardhat run --network hardhat .\scripts\community\deploy_community.ts

Deploy to ganache
npx hardhat run --network ganache .\scripts\utility\deploy_utility.ts
npx hardhat run --network ganache .\scripts\genericMultiChainDecisionManagement\deploy_decision_management.ts
npx hardhat run --network ganache .\scripts\community\deploy_community.ts


Deploy to palm
npx hardhat run --network palm .\scripts\utility\deploy_utility.ts
npx hardhat run --network palm .\scripts\genericMultiChainDecisionManagement\deploy_decision_management.ts

npx hardhat run --network palm .\scripts\community\deploy_community.ts

Run Hardhat

Run Palm
npx hardhat run --network palm .\scripts\frontend\community_frontend.ts
npx hardhat run --network palm .\scripts\community\get_community_events.ts

Run Aurora 
npx hardhat run --network aurora .\scripts\frontend\community_frontend.ts
npx hardhat run --network aurora .\scripts\community\get_community_events.ts