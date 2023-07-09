
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
// Decision Management Contract

import "../utility/UtilityProxy.sol";
import "../utility/IUtilityImpl.sol";
import "../oracle/MultiChainOracleSmartContract.sol";
//import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
//import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

interface IDecisionManagementImpl  {

    function createProposal(string calldata _description, uint communityId, string memory _communityName, address _proposingMemberAddress, uint _proposingMemberChainId, IUtilityImpl.CommunityRestriction _communityRestriction,IUtilityImpl.VotingStructure memory _votingStructure, uint256 _proposalBudget, uint _quorum, uint256 _startTime, uint256 _endTime, address _proposalImplementationAddress, string[] calldata _tags) external returns (uint256 proposalId);
    function vote(IUtilityImpl.Vote calldata voteData, uint communityId) external;
    //function getProposalResult(uint256 proposalIndex) external;
    /*function getProposalResult(uint256 proposalId) external view returns (
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
);*/
    function getProposalBasicInfoAndContraintsWithoutVotesById(uint256 proposalId) external view returns (
    IUtilityImpl.ProposalBasicData memory proposalBasicData);

    function executeProposal(uint256 proposalIndex) external;

    function allowCommunity(address communityContract) external;

    function disallowCommunity(address communityContract) external;     

    function transferVoteCost(IUtilityImpl.Vote memory voteData, uint cost) external returns (bool result);
       
}