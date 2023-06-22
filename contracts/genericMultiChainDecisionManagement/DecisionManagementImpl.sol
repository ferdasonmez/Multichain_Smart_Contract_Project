
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

    IUtilityImpl.CommunityData public community;

    UtilityProxy public utilityProxy;
    IUtilityImpl utilityImpl;

    constructor(address _utilityProxyAddress) {
        /*utilityImpl = IUtilityImpl(
            UtilityProxy(_utilityProxyAddress).implementation()
            
        );*/
        UtilityProxy proxy = UtilityProxy(payable(address(_utilityProxyAddress)));
        //utilityImpl = MyUtilityImpl(address(proxy.implementation)).address;
        //utilityImpl = address(proxy.implementation);
        
        utilityImpl = IUtilityImpl(address(proxy.implementation.address));
    }

    event ProposalCreated(
        uint256 proposalId,
        string description,
        address proposingMemberAddress,
        uint256 votingType,
      /*  IUtilityImpl.VotingStructure votingStructure,*/
        uint256 startTime,
        uint256 endTime,
        address proposalImplementationAddress
    );

    event ProposalCreated(
        uint256 indexed proposalId,
        string description,
        address indexed proposingMemberAddress,
        uint proposingMemberChainId,
        uint decisionManagerCommunityId,
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
        address _proposingMemberAddress,
        uint _proposingMemberChainId,
        uint256 _votingType,
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
        proposal.decisionManagerCommunityId = community.id;
        proposal.proposalBudget = _proposalBudget;
        proposal.startTime = _startTime;
        proposal.endTime = _endTime;
        proposal.votingType = _votingType;
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
        proposal.decisionManagerCommunityId,
        proposal.proposalBudget,
        proposal.numberOfVotes,
        proposal.executed,
        proposal.passed,
        proposal.quorum,
        proposal.startTime,
        proposal.endTime,
        proposal.votingType,
        proposal.proposalImplementationAddress,
        proposal.tags
    );
    }

    function vote(
        uint256 proposalIndex,
        IUtilityImpl.Vote calldata voteData
    ) public {
        IUtilityImpl.Proposal storage proposal = proposals[proposalIndex];
        uint256 votingType = proposal.votingType;
         (uint[] memory votingStructureKeys, IUtilityImpl.VotingStructure[] memory votingStructureValues) = utilityImpl.getVotingStructures();
         //ferda @todo we may need to find the key and use it in values array
         IUtilityImpl.VotingStructure memory votingStructure = votingStructureValues[proposal.votingType];

        // Check if the voter has not already voted on this proposal
        bytes32 voterHash = keccak256(
            abi.encodePacked(voteData.voterAddress, voteData.voterChainId)
        );
        require(proposal.voted[voterHash] == 0, "Already voted.");

        // Check if the proposal is open for voting
        require(
            block.timestamp >= proposal.startTime &&
                block.timestamp <= proposal.endTime,
            "Voting not open."
        );

        // Record the vote
        proposal.numberOfVotes += 1;
        proposal.votes[voterHash] = voteData;

        proposal.executed = false;
        proposal.passed = false;
    }

    function getProposalResult(uint256 proposalIndex) public {
        /*  IUtilityImpl.Proposal storage proposal = proposals[proposalIndex];

        // Check if the voter has not already voted on this proposal
        bytes32 voterHash = keccak256(abi.encodePacked(voteData.voterAddress, voteData.voterChainId));
        require(proposal.voted[voterHash] == 0, "Already voted.");

        // Check if the proposal is open for voting
        require( block.timestamp >= proposal.endTime, "Voting not ended.");



        // Call the off-chain http function to process the votes and update the proposal state
        // This is just an example implementation and you will need to implement your own off-chain logic here
        bool voteResult = processVotesOffChain(proposal);
        proposal.executed = true;
        proposal.passed = voteResult;*/
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