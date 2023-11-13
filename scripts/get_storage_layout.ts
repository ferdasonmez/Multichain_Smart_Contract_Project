const solc = require('solc');
const path = require("path");
const fs = require("fs");
function getContractSourceCode () {
  try {
    const dir = path.resolve(
      __dirname,
      "./../contracts/community/MultiChainCommunity.sol"
    )
    const sourceCode = fs.readFileSync(dir, "utf8")
  


    return sourceCode
  } catch (e) {
    console.log(`e`, e)
  }
}

const contractSourceCode = getContractSourceCode();

const input = {
  language: 'Solidity',
  sources: {
    'MultiChainCommunity.sol': {
      content: contractSourceCode,
    },
  },
  settings: {
    outputSelection: {
      '*': {
        '*': ['storageLayout'],
      },
    },
  },
};

const output = JSON.parse(solc.compile(JSON.stringify(input)));
console.log(output);
const storageLayout = output.contracts['MultiChainCommunity'].storageLayout;

// Iterate over the storage layout and access the required information
for (const variableName 
  
  in storageLayout) {
  const variable = storageLayout[variableName];
  const { astId, contract, label, offset, slot, type } = variable;

  console.log('Variable:', variableName);
  console.log('AST ID:', astId);
  console.log('Contract:', contract);
  console.log('Label:', label);
  console.log('Offset:', offset);
  console.log('Slot:', slot);
  console.log('Type:', type);
  console.log('---');
}
