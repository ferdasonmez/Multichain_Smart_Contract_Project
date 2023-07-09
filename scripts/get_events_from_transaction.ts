//const { ethers } = require("hardhat");

const myContractAddress = "0x123456789...";
const myContractAbi = [
  "event MyEvent(uint256 indexed value)",
  "function emitEvent(uint256 value) public",
];

async function main_get_transactions() {
  const provider = new ethers.providers.JsonRpcProvider();
  const myContract = new ethers.Contract(myContractAddress, myContractAbi, provider);
  provider.on("disconnect", () => {
    console.log("Disconnected from the WebSocket provider");
  });
  
  provider.on("error", (error) => {
    console.error("WebSocket provider error:", error);
  });
  myContract.on("MyEvent", (value) => {
    console.log(`MyEvent emitted with value ${value}`);
  });

  // Call the emitEvent function to emit the event
  const tx = await myContract.emitEvent(42);
  await tx.wait();
}

main_get_transactions()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
