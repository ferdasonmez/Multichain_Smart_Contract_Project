
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
// Decision Management Contract

import "../utility/UtilityProxy.sol";
import "../utility/IUtilityImpl.sol";
import "../oracle/MultiChainOracleSmartContract.sol";
//import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
//import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

interface IDecisionManagementImpl  {

    function createProposal(string calldata _description, uint communityId, address _proposingMemberAddress, uint _proposingMemberChainId, uint256 _votingType, IUtilityImpl.VotingStructure calldata _votingStructure, uint256 _proposalBudget, uint _quorum, uint256 _startTime, uint256 _endTime, address _proposalImplementationAddress, string[] calldata _tags) external returns (uint256 proposalId);

    function vote(uint256 proposalIndex, IUtilityImpl.Vote calldata voteData) external;
    function getProposalResult(uint256 proposalIndex) external;

    function executeProposal(uint256 proposalIndex) external ;
}