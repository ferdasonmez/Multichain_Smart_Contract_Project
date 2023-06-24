import { execSync } from 'child_process';

// Get the network from command line arguments
const network =  process.env.HARDHAT_NETWORK;

// Check if network is provided
if (!network) {
  console.error('Network argument is missing.');
  process.exit(1);
}

// Run the deployment commands in order
try {
  execSync(`npx hardhat run --network ${network} ./scripts/utility/deploy_utility.ts`);
  execSync(`npx hardhat run --network ${network} ./scripts/genericMultiChainDecisionManagement/deploy_decision_management.ts`);
  execSync(`npx hardhat run --network ${network} ./scripts/community/deploy_community.ts`);
} catch (error) {
  console.error('Error running deployment scripts:', error);
}
