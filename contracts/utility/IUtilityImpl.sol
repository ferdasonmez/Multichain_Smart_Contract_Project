// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IUtilityImpl {
    struct VotingStructure {
        string[] voteCategoryNames;
        uint256 voteInputType;
        uint256 voteCostType;
        uint256 lowerLimit;
        uint256 upperLimit;
    }

    struct Vote {
        uint proposalId;
        VoteValue[] voteValues;
        address voterAddress;
        uint voterChainId;
        uint chainCurrentVotingWeight;
    }

    struct VoteValue {
        uint256 voteValue;
        string voteCategoryName;
    }

    struct Proposal {
        uint256 id;
        string description;
        address proposingMemberAddress;
        uint proposingMemberChainId;
        uint decisionManagerCommunityId;
        mapping(bytes32 =>uint) voted; // using bytes32 hash of address and chain_id 
        mapping(bytes32 => Vote) votes; // using bytes32 hash of address and chain_id
        uint256 proposalBudget;
        uint256 numberOfVotes;
        bool executed;
        bool passed;
        uint quorum;
        uint256 startTime;
        uint256 endTime;
        uint256 votingType;
        address proposalImplementationAddress;
        string[] tags;
    }

    struct AccountChainPair {
        address account;
        uint chainId;
        string[] tags;
    }

    struct CommunityData {
        uint256 id;
        string name;
        AccountChainPair[] members;
        mapping(uint256 => uint256) chainWeights; //chainId =>chainweight
        mapping(bytes => uint256) chainProposalWeights; //keccak (chainId + proposalId) =>chainProposalweight
    }

    struct TransferData {
        address sender;
        address receiver;
        uint256 amount;
        string currencyType;
        bytes memo;
    }
    
    struct ContractFunctionCallData {
        address targetContractAddress;
        string targetcontractName;
        string targetfunctionName;
        bytes parameters;
    }

    function getBridgeImplementation(uint256 fromChainId, uint256 toChainId) external view returns (address);
    
    function setBridgeImplementation(uint256 fromChainId, uint256 toChainId, address bridgeImplAddress) external ;

    function getChainId() external view returns (uint256);
    
    function getVotingStructures() external view returns ( uint[] memory, VotingStructure[] memory);

    function getChainName(uint256 chainId) external view returns (string memory);
    
    function generateUniqueId() external returns (uint);

}
