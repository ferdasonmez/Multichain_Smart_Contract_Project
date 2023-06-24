const { execSync } = require('child_process');

// Get the network from command line arguments
const network = process.env.HARDHAT_NETWORK;

// Check if network is provided
if (!network) {
  console.error('Network argument is missing.');
  process.exit(1);
}

// Start the CLI client
try {
  const cliClientCommand = `cross-env TITLE="${network} Community CLI Client" npx hardhat run --network ${network} ./scripts/frontend/application_frontend.ts`;
  execSync(cliClientCommand);
} catch (error) {
  console.error('Error executing CLI client script:', error);
}

// Start the events listener
try {
  const eventsListenerCommand = `cross-env TITLE="${network} Community Events Listener" npx hardhat run --network ${network} ./scripts/community/get_community_events.ts`;
  execSync(eventsListenerCommand);
} catch (error) {
  console.error('Error executing events listener script:', error);
}
