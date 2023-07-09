
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
// Decision Management Contract

import "../utility/UtilityProxy.sol";
import "../utility/IUtilityImpl.sol";
import "../oracle/MultiChainOracleSmartContract.sol";
import "./IDecisionManagementImpl.sol";
import "../genericProposalAction/ProposalActionContract.sol";
import "../genericProposalAction/IProposalActionContract.sol";
//import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
//import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
//import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import { OwnableUpgradeable as MyOwnableUpgradeable } from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

contract DecisionManagementImpl is MyOwnableUpgradeable, IDecisionManagementImpl {
    IUtilityImpl.Proposal[] proposals;

    UtilityProxy public utilityProxy;
    IUtilityImpl utilityImpl;

    constructor(address _utilityProxyAddress) {
        UtilityProxy proxy = UtilityProxy(payable(address(_utilityProxyAddress)));
        
        utilityImpl = IUtilityImpl(address(proxy.implementation.address));
    }



    event ProposalCreated(
        uint256 indexed proposalId,
        string description,
        address indexed proposingMemberAddress,
        uint proposingMemberChainId,
        uint proposingCommunityId,
        string proposingCommunityName,
        uint256 proposalBudget,
        uint256 numberOfVotes,
        bool executed,
        bool passed,
        uint quorum,
        uint256 startTime,
        uint256 endTime,
        uint256 votingType,
        address proposalImplementationAddress,
        string[] tags
    );
    function createProposal(
        string memory _description,
        uint _communityId,
        string memory _communityName,
        address _proposingMemberAddress,
        uint _proposingMemberChainId,
        IUtilityImpl.CommunityRestriction _communityRestriction,
        IUtilityImpl.VotingStructure memory _votingStructure,
        uint256 _proposalBudget,
        uint _quorum,
        uint256 _startTime,
        uint256 _endTime,
        address _proposalImplementationAddress,
        string[] memory _tags
    ) public returns (uint256 proposalId) {
        uint256 _proposalId = utilityImpl.generateUniqueId();

        // Create the new proposal
        IUtilityImpl.Proposal storage proposal = proposals.push();
        
        proposal.id = _proposalId;
        proposal.description = _description;
        proposal.proposingMemberAddress = _proposingMemberAddress;
        proposal.proposingMemberChainId = _proposingMemberChainId;
        proposal.proposingCommunityId = _communityId;
        proposal.proposingCommunityName = _communityName;
        proposal.proposalBudget = _proposalBudget;
        proposal.startTime = _startTime;
        proposal.endTime = _endTime;
        proposal.votingStructureId = _votingStructure.votingStructureId;
        proposal.quorum = _quorum;
        proposal.proposalImplementationAddress = _proposalImplementationAddress;
        proposal.tags = _tags;
        //Set the voting structure for the proposal
        //proposal.votingStructure = _votingStructure;

    // Emit the ProposalCreated event with all the fields
    emit ProposalCreated(
        proposalId,
        proposal.description,
        proposal.proposingMemberAddress,
        proposal.proposingMemberChainId,
        proposal.proposingCommunityId,
        proposal.proposingCommunityName,
        proposal.proposalBudget,
        proposal.numberOfVotes,
        proposal.executed,
        proposal.passed,
        proposal.quorum,
        proposal.startTime,
        proposal.endTime,
        proposal.votingStructureId,
        proposal.proposalImplementationAddress,
        proposal.tags
    );
    }
    mapping(address => bool) private allowedCommunities;

    modifier onlyThroughAllowedCommunities() {
        require(allowedCommunities[msg.sender], "Caller is not an allowed Community contract");
        _;
    }

    function allowCommunity(address communityContract) external onlyOwner {
        allowedCommunities[communityContract] = true;
    }

    function disallowCommunity(address communityContract) external onlyOwner {
        allowedCommunities[communityContract] = false;
    }
  function getProposalBasicInfoAndContraintsWithoutVotesById(uint256 proposalId) public view returns (IUtilityImpl.ProposalBasicData memory proposalBasicData) {
        IUtilityImpl.Proposal storage proposal = proposals[proposalId];

        /*id = proposal.id;
        description = proposal.description;
        proposingMemberAddress = proposal.proposingMemberAddress;
        proposingMemberChainId = proposal.proposingMemberChainId;
        proposingCommunityId = proposal.proposingCommunityId;
        proposingCommunityName = proposal.proposingCommunityName;
        communityRestriction = uint(proposal.communityRestriction);
        /*numberOfVotes = proposal.numberOfVotes;
        numberOfYesVotes = proposal.numberOfYesVotes;
        numberOfNoVotes = proposal.numberOfNoVotes;
        sumOfYesVotes = proposal.sumOfYesVotes;
        sumOfNoVotes = proposal.sumOfNoVotes;
        executed = proposal.executed;
        passed = proposal.passed;
        quorum = proposal.quorum;*/
        /*startTime = proposal.startTime;
        endTime = proposal.endTime;
        votingStructureId = proposal.votingStructureId;*/
        /*proposalBudget = proposal.proposalBudget;
        proposalImplementationAddress = proposal.proposalImplementationAddress;*/
        /*tags = proposal.tags;*/

        //IUtilityImpl.ProposalBasicData memory proposalBasicData;
      
        proposalBasicData.proposalId = proposal.id;
        proposalBasicData.description = proposal.description;
        proposalBasicData.proposingMemberAddress = proposal.proposingMemberAddress;
        proposalBasicData.proposingMemberChainId = proposal.proposingMemberChainId;
        proposalBasicData.proposingCommunityId = proposal.proposingCommunityId;
        proposalBasicData.proposingCommunityName = proposal.proposingCommunityName;
        proposalBasicData.proposalCommunityRestriction = uint(proposal.communityRestriction);
        /*numberOfVotes = proposal.numberOfVotes;
        numberOfYesVotes = proposal.numberOfYesVotes;
        numberOfNoVotes = proposal.numberOfNoVotes;
        sumOfYesVotes = proposal.sumOfYesVotes;
        sumOfNoVotes = proposal.sumOfNoVotes;
        executed = proposal.executed;
        passed = proposal.passed;
        quorum = proposal.quorum;*/
        proposalBasicData.startTime = proposal.startTime;
        proposalBasicData.endTime = proposal.endTime;
        proposalBasicData.votingStructureId = proposal.votingStructureId;
        /*proposalBudget = proposal.proposalBudget;
        proposalImplementationAddress = proposal.proposalImplementationAddress;*/
        proposalBasicData.tags = proposal.tags;

 

    }

 /*   function getProposalResult(uint256 proposalId) public view returns (
    uint256 id,
    uint256 numberOfVotes,
    uint256 numberOfYesVotes,
    uint256 numberOfNoVotes,
    uint256 sumOfYesVotes,
    uint256 sumOfNoVotes,
    bool executed,
    bool passed,
    uint quorum,
    uint256 startTime,
    uint256 endTime,
    uint256 proposalBudget,
    address proposalImplementationAddress,
    string[] memory tags
) {
        IUtilityImpl.Proposal storage proposal = proposals[proposalId];
        
        id = proposal.id;
        numberOfVotes = proposal.numberOfVotes;
        numberOfYesVotes = proposal.numberOfYesVotes;
        numberOfNoVotes = proposal.numberOfNoVotes;
        sumOfYesVotes = proposal.sumOfYesVotes;
        sumOfNoVotes = proposal.sumOfNoVotes;
        executed = proposal.executed;
        passed = proposal.passed;
        quorum = proposal.quorum;
        startTime = proposal.startTime;
        endTime = proposal.endTime;
        proposalBudget = proposal.proposalBudget;
        proposalImplementationAddress = proposal.proposalImplementationAddress;
        tags = proposal.tags;
    }*/



    function transferVoteCost(IUtilityImpl.Vote memory voteData, uint cost) public returns (bool result) {
        // Perform the necessary logic here
        // You can use the provided voteData and cost parameters to implement the transfer

        // Return the result of the transfer
        return true;
    }
    
    function vote(IUtilityImpl.Vote calldata voteData, uint communityId) public onlyThroughAllowedCommunities {
        IUtilityImpl.Proposal storage proposal = proposals[voteData.proposalId];

        (uint[] memory votingStructureKeys, IUtilityImpl.VotingStructure[] memory votingStructureValues) = utilityImpl.getVotingStructuresById();
      
        IUtilityImpl.VotingStructure memory votingStructure = votingStructureValues[proposal.votingStructureId];
        require(voteData.numericValue  >= votingStructure.lowerLimit, "Voting value can not be lower than the predefined limit.");
        require(voteData.numericValue  <= votingStructure.upperLimit, "Voting value can not be higher than the predefined limit.");

        // Check if the voter has not already voted on this proposal
        bytes32 voterHash = keccak256(
            abi.encodePacked(voteData.voterAddress, voteData.voterChainId,voteData.proposalId)
        );
        require(proposal.voted[voterHash] == 0, "Already voted for this proposal.");

        // Check if the proposal is open for voting
        require(
            block.timestamp >= proposal.startTime &&
                block.timestamp <= proposal.endTime,
            "Voting not open."
        );
        //We need to get the cost for the votes based on voting cost
        IUtilityImpl.VoteCostType voteCostType = votingStructure.voteCostType;
        require(voteCostType == IUtilityImpl.VoteCostType.Free ||
        ((voteCostType == IUtilityImpl.VoteCostType.OneTokenPerVote) && transferVoteCost(voteData, 1)) ||
        (voteCostType == IUtilityImpl.VoteCostType.SameAsVoteAmount && transferVoteCost(voteData, voteData.numericValue)) ||
        (voteCostType == IUtilityImpl.VoteCostType.Quadratic && transferVoteCost(voteData, voteData.numericValue * voteData.numericValue)),
        "Caller is not eligible to pay for the vote cost based on the selected scheme for this proposal."
    );



        // Record the vote
        proposal.numberOfVotes += 1;
        proposal.votes[voterHash] = voteData;
        if (voteData.yesno){
            proposal.numberOfYesVotes += 1;
            proposal.sumOfYesVotes += voteData.numericValue;
        }else{
            proposal.numberOfNoVotes += 1;
            proposal.sumOfNoVotes += voteData.numericValue;
        }
        proposal.executed = false;
        proposal.passed = false;
    }



    function executeProposal(uint256 proposalIndex) public {
        IUtilityImpl.Proposal storage proposal = proposals[proposalIndex];
        address proposalContractAddress = proposal.proposalImplementationAddress;
        
        // Check if the proposal has not already been executed
        require(!proposal.executed, "Already executed.");
        require(proposalContractAddress != address(0), "There is no associated Proposal Contract to Execute.");
        // Check if the proposal has enough support
        /*require(
            proposal.forVotes > proposal.againstVotes,
            "Proposal did not pass."
        );*/

        // Execute the proposal
        //IProposalActionContract proposalActionContract = ProposalActionContract(payable(address(proposalContractAddress)));
        proposal.executed = true;

        // Do something with the proposal
    }

    function _authorizeUpgrade(
        address newImplementation
    ) internal virtual  {}
}