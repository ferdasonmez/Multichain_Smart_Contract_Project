const { keccak256, defaultAbiCoder } = require('ethers').utils;


const { ethers } = require("ethers");
const path = require("path");
const fs = require("fs");
function getByteCode () {
  try {
    const dir = path.resolve(
      __dirname,
      "./../artifacts/contracts/community/MultiChainCommunity.sol/MultiChainCommunity.json"
    )
    const file = fs.readFileSync(dir, "utf8")
    const json = JSON.parse(file)
    const bytecode = json.bytecode


    return bytecode
  } catch (e) {
    console.log(`e`, e)
  }
}

function getDeployedByteCode () {
  try {
    const dir = path.resolve(
      __dirname,
      "./../artifacts/contracts/community/MultiChainCommunity.sol/MultiChainCommunity.json"
    )
    const file = fs.readFileSync(dir, "utf8");
    const json = JSON.parse(file);
    const deployedBytecode = json.deployedBytecode;
    //console.log(deployedBytecode)

    return deployedBytecode;
  } catch (e) {
    console.log(`e`, e)
  }
}



var variableNames=["communityDataJson", "operation", "operationAccount", "operationChainID", "operationTags", "id", "parentCommunityAddress", "parentCommunityId", "name", "memberAccounts", "memberChainIds", "memberTags",
"chainWeights", "chainProposalWeights","memberTokenBalances", "decisionManagerImpl", "utilityImpl", "denemeString", "communityDataMembersSlot", "memberTokenBalancesSlot", "currentChainName", "currentChainId"];
for (let varName of variableNames) {
  const regex = new RegExp(`\\b${varName}\\b`, 'g');
  const matches = [getDeployedByteCode().matchAll(regex)];
  
  if (matches.length > 0) {
    const varPosition = matches[0].index;
    console.log(`Variable ${varName} position: ${varPosition}`);
  } else {
    console.log(`Variable ${varName} not found`);
  }
  let varPosition = getByteCode().indexOf(ethers.utils.hexlify(ethers.utils.toUtf8Bytes(varName)));

  console.log(`Variable ${varName} position: ${varPosition}`);
  const varBytecode = keccak256(defaultAbiCoder.encode(['string'], [varName])); 
  //varPosition = getDeployedByteCode().indexOf(ethers.utils.hexlify(ethers.utils.toUtf8Bytes(varName)));
  varPosition = getDeployedByteCode().indexOf(varBytecode);

  console.log(`Variable ${varName} position: ${varPosition}`);
}
/*const variableName = "denemeString";

const variablePosition = bytecode.indexOf(variableName);

console.log(`Variable ${variableName} position: ${variablePosition}`);*/