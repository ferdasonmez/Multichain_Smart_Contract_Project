import { ethers } from "ethers";
//import { COMMUNITY_ABI } from './abi_constants';
import { HARD_HAT_RPC_URL, GANACHE_RPC_URL, GOERLI_RPC_URL, PALM_RPC_URL, AURORA_RPC_URL } from './constants';
import { HARD_HAT_COMMUNITY_IMPLEMENTATION_ADDRESS, GOERLI_COMMUNITY_IMPLEMENTATION_ADDRESS, GANACHE_COMMUNITY_IMPLEMENTATION_ADDRESS, PALM_COMMUNITY_IMPLEMENTATION_ADDRESS, AURORA_COMMUNITY_IMPLEMENTATION_ADDRESS } from './constants';
import {SAMPLE_ADDRESS1, SAMPLE_ADDRESS2} from './constants';
function getTheAbi () {
  try {
    /*const dir = path.resolve(
      __dirname,
      "./artifacts/contracts/community\\MultiChainCommunity.sol/MultiChainCommunity.json"
    )*/

    const dir = path.resolve(
      __dirname,
      "../artifacts/contracts/community/MultiChainCommunity.sol/MultiChainCommunity.json"
    )
    const file = fs.readFileSync(dir, "utf8")
    const json = JSON.parse(file)
    const abi = json.abi
    //console.log(`abi`, abi)

    return abi
  } catch (e) {
    console.log(`e`, e)
  }
}
async function estimateGasCosts() {
  const provider = new ethers.providers.JsonRpcProvider("YOUR_RPC_URL");
  const gasPrice = await provider.getGasPrice();

  const contract = new ethers.Contract(contract_address, getTheAbi(), provider);

  //const gasEstimates = {};


 /*
  // Estimate gas cost for getElementIndexForMemberChainIdsInStorage
  const estimateChainIds = await contract.estimateGas.getElementIndexForMemberChainIdsInStorage(123); // Replace with actual input value
  const gasCostChainIds = estimateChainIds.mul(gasPrice);
  console.log("Gas cost for getElementIndexForMemberChainIdsInStorage:", gasCostChainIds.toString());

  // Estimate gas cost for getElementIndexForMemberAccountIdsInStorage
  const estimateAccountIds = await contract.estimateGas.getElementIndexForMemberAccountIdsInStorage(456); // Replace with actual input value
  const gasCostAccountIds = estimateAccountIds.mul(gasPrice);
  console.log("Gas cost for getElementIndexForMemberAccountIdsInStorage:", gasCostAccountIds.toString());

  // Estimate gas cost for getElementIndexForMemberTagsInStorage
  const estimateMemberTags = await contract.estimateGas.getElementIndexForMemberTagsInStorage(1, 2); // Replace with actual input values
  const gasCostMemberTags = estimateMemberTags.mul(gasPrice);
  console.log("Gas cost for getElementIndexForMemberTagsInStorage:", gasCostMemberTags.toString());

  // Estimate gas cost for getElementIndexForValuesChainWeightsInStorage
  const estimateChainWeights = await contract.estimateGas.getElementIndexForValuesChainWeightsInStorage(3); // Replace with actual input value
  const gasCostChainWeights = estimateChainWeights.mul(gasPrice);
  console.log("Gas cost for getElementIndexForValuesChainWeightsInStorage:", gasCostChainWeights.toString());

  const estimateConstructor = await contract.estimateGas.deploy(
    123,                             // communityId
    "Community Name",                // communityName
    "Utility Proxy Address",         // _utilityProxyAddress
    "Decision Manager Proxy Address",// _decisionManagerProxyAddress
    "Parent Community Address",      // _parentCommunityAddress
    789,                             // _parentCommunityId
    ["Tag1", "Tag2"],                // _tags
    "Tags Joined",                   // _tagsJoined
    456,                             // chainID
    "Chain Name",                    // chainName
    "Sample Address 1",              // SAMPLE_ADDRESS1
    "Sample Address 2"               // SAMPLE_ADDRESS2
  );
  const gasCostConstructor = estimateConstructor.mul(gasPrice);
  console.log("Gas cost for constructor:", gasCostConstructor.toString());

  // Estimate gas cost for getCommunityBalance
  const tokenAddress = "TOKEN_ADDRESS"; // Replace with actual token address
  const estimateBalance = await contract.estimateGas.getCommunityBalance(tokenAddress);
  const gasCostBalance = estimateBalance.mul(gasPrice);
  console.log("Gas cost for getCommunityBalance:", gasCostBalance.toString());

  // Estimate gas cost for withdrawERC20TokenFrom
  const tokenAmount = 100; // Replace with actual token amount
  const estimateWithdraw = await contract.estimateGas.withdrawERC20TokenFrom(tokenAddress, tokenAmount);
  const gasCostWithdraw = estimateWithdraw.mul(gasPrice);
  console.log("Gas cost for withdrawERC20TokenFrom:", gasCostWithdraw.toString());

  // Estimate gas cost for contribute
  const tokenAmountContribute = 200; // Replace with actual token amount
  const estimateContribute = await contract.estimateGas.contribute(tokenAddress, tokenAmountContribute);
  const gasCostContribute = estimateContribute.mul(gasPrice);
  console.log("Gas cost for contribute:", gasCostContribute.toString());
*/
 // Estimate gas cost for addMember
 const memberAddress = SAMPLE_ADDRESS1; // Replace with actual member address
 const chainIdAddMember = 123; // Replace with actual chain ID
 const tagsAddMember = ["Tag1", "Tag2"]; // Replace with actual tags
 const estimateAddMember = await contract.estimateGas.addMember(memberAddress, chainIdAddMember, tagsAddMember);
 const gasCostAddMember = estimateAddMember.mul(gasPrice);
 console.log("Gas cost for addMember:", gasCostAddMember.toString());
/*
 // Estimate gas cost for removeMember
 const memberAddressRemove = "0xMemberAddress"; // Replace with actual member address
 const chainIdRemoveMember = 123; // Replace with actual chain ID
 const estimateRemoveMember = await contract.estimateGas.removeMember(memberAddressRemove, chainIdRemoveMember);
 const gasCostRemoveMember = estimateRemoveMember.mul(gasPrice);
 console.log("Gas cost for removeMember:", gasCostRemoveMember.toString());

 // Estimate gas cost for initializeAllChainDefaultWeights
 const initialValue = 123; // Replace with actual initial value
 const estimateInitWeights = await contract.estimateGas.initializeAllChainDefaultWeights(initialValue);
 const gasCostInitWeights = estimateInitWeights.mul(gasPrice);
 console.log("Gas cost for initializeAllChainDefaultWeights:", gasCostInitWeights.toString());

 // Estimate gas cost for setChainDefaultWeight
 const chainIdSetDefaultWeight = 123; // Replace with actual chain ID
 const weightSetDefaultWeight = 456; // Replace with actual weight
 const estimateSetDefaultWeight = await contract.estimateGas.setChainDefaultWeight(chainIdSetDefaultWeight, weightSetDefaultWeight);
 const gasCostSetDefaultWeight = estimateSetDefaultWeight.mul(gasPrice);
 console.log("Gas cost for setChainDefaultWeight:", gasCostSetDefaultWeight.toString());

 // ... Continue estimating gas costs for other functions
 const memberAddressSetProposalWeights = "0xMemberAddress"; // Replace with actual member address
  const chainIdSetProposalWeights = 123; // Replace with actual chain ID
  const proposalIdSetProposalWeights = 456; // Replace with actual proposal ID
  const weightSetProposalWeights = 789; // Replace with actual weight
  const estimateSetProposalWeights = await contract.estimateGas.setMemberProposalWeights(
    memberAddressSetProposalWeights,
    chainIdSetProposalWeights,
    proposalIdSetProposalWeights,
    weightSetProposalWeights
  );
  const gasCostSetProposalWeights = estimateSetProposalWeights.mul(gasPrice);
  console.log("Gas cost for setMemberProposalWeights:", gasCostSetProposalWeights.toString());

  // Estimate gas cost for setMemberWeights
  const memberAddressSetWeights = "0xMemberAddress"; // Replace with actual member address
  const chainIdSetWeights = 123; // Replace with actual chain ID
  const weightSetWeights = 456; // Replace with actual weight
  const estimateSetWeights = await contract.estimateGas.setMemberWeights(
    memberAddressSetWeights,
    chainIdSetWeights,
    weightSetWeights
  );
  const gasCostSetWeights = estimateSetWeights.mul(gasPrice);
  console.log("Gas cost for setMemberWeights:", gasCostSetWeights.toString());

  // Estimate gas cost for isMember
  const memberAddressIsMember = "0xMemberAddress"; // Replace with actual member address
  const chainIdIsMember = 123; // Replace with actual chain ID
  const estimateIsMember = await contract.estimateGas.isMember(memberAddressIsMember, chainIdIsMember);
  const gasCostIsMember = estimateIsMember.mul(gasPrice);
  console.log("Gas cost for isMember:", gasCostIsMember.toString());
*/
  // Estimate gas cost for createProposal
  // ... (provide actual parameter values)
  // const estimateCreateProposal = await contract.estimateGas.createProposal(...);
  // const gasCostCreateProposal = estimateCreateProposal.mul(gasPrice);
  // console.log("Gas cost for createProposal:", gasCostCreateProposal.toString());

  // Estimate gas cost for voteForAProposal
  // ... (provide actual parameter values)
  // const estimateVoteForProposal = await contract.estimateGas.voteForAProposal(...);
  // const gasCostVoteForProposal = estimateVoteForProposal.mul(gasPrice);
  // console.log("Gas cost for voteForAProposal:", gasCostVoteForProposal.toString());

  //console.log("Gas Estimates:", gasEstimates);
}

let contract_address: string = '';
const selected_network = process.env.HARDHAT_NETWORK;
if (selected_network === "hardhat") {
  contract_address = HARD_HAT_COMMUNITY_IMPLEMENTATION_ADDRESS;
}  else if (selected_network === "ganache") {
  contract_address = GANACHE_COMMUNITY_IMPLEMENTATION_ADDRESS;
} else if (selected_network === "goerli") {
  contract_address = GOERLI_COMMUNITY_IMPLEMENTATION_ADDRESS;
}else if (selected_network === "palm") {
  contract_address = PALM_COMMUNITY_IMPLEMENTATION_ADDRESS;
} else if (selected_network === "aurora") {
  contract_address = AURORA_COMMUNITY_IMPLEMENTATION_ADDRESS;
} else {
  throw new Error('Invalid chain selected');
}
estimateGasCosts();
