// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../storage/IHasUpgradableEternalStorage.sol";
//import "./IUtilityImpl.sol";
import { IUtilityImpl as MyIUtilityImpl } from "./IUtilityImpl.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

contract UtilityImpl is OwnableUpgradeable, MyIUtilityImpl {
    //uint256 MAX_INT = 1157920892373161954235709850086879078532699846656405640394575840079131296399;
    enum VotingTypes {
        SingleVote_Free_VotingType,
        SingleVote_OneTokenPerVote_VotingType,
        Limitless_TokenSameAsVote_VotingType,
        Limited_1_to_10_Quadratic_VotingType
    }


    mapping(uint => VotingStructure) public votingTypeVotingStructure; //VotingType to VotingStructure
    mapping(uint => VotingStructure) public votingStructureIdVotingStructure; //VotingStructureId to VotingStructure
    mapping(uint => string) public chainNames; //chainId to chainName
    mapping(bytes32 => address) public bridgeImplementations;

    enum  chainNamesEnum  { Ethereum_main_network, Ethereum_classic_main_network, Hardhat, Ganache, Goerli, Palm_testnet, Aurora_testnet }

    mapping(chainNamesEnum => uint) public chainEnumToIds;
    mapping(chainNamesEnum => string) public chainEnumToChainName;
    uint NUMBEROFVOTINGSTRUCTURES = 4; 
    function initializeChains(string[] memory chainNamesInput,  uint256[] memory chainIds) internal {
        for (uint256 i = 0; i < chainNamesInput.length; i++) {
            chainEnumToChainName[chainNamesEnum(i)] = chainNamesInput[i];
            chainNames[i] = chainNamesInput[i];
            chainEnumToIds[chainNamesEnum(i)] = chainIds[i];
        }
        
        /*chainEnumToChainName[chainNamesEnum.Ethereum_main_network] = "Ethereum main network";
        chainEnumToChainName[chainNamesEnum.Ethereum_classic_main_network] = "Ethereum classic main network";
        chainEnumToChainName[chainNamesEnum.Hardhat] = "Hardhat network";
        chainEnumToChainName[chainNamesEnum.Ganache] = "Ganache network";
        chainEnumToChainName[chainNamesEnum.Goerli] = "Goerli network";
        chainEnumToChainName[chainNamesEnum.Palm_testnet] = "Palm test network";
        chainEnumToChainName[chainNamesEnum.Aurora_testnet] = "Aurora test network";

        chainEnumToIds[chainNamesEnum.Ethereum_main_network] = 1;
        chainEnumToIds[chainNamesEnum.Ethereum_classic_main_network] = 63;
        chainEnumToIds[chainNamesEnum.Hardhat] = 1338;
        chainEnumToIds[chainNamesEnum.Goerli] = 5;
        chainEnumToIds[chainNamesEnum.Ganache] = 1337;
        chainEnumToIds[chainNamesEnum.Palm_testnet] = 11297108099;
        chainEnumToIds[chainNamesEnum.Aurora_testnet] = 1313161555;*/
    }
    
    function initializeVotingStructures() internal {
    // Initialize Yes/No Voting Structure

    VotingStructure memory singleVoteFreeStructure = VotingStructure(
        1,
        "SingleVote_Free_VotingType",
        VoteCostType.Free,
        address(0), // Address of the token, set to zero address for free voting
        1,
        1
    );
    votingTypeVotingStructure[uint(VotingTypes.SingleVote_Free_VotingType)] = singleVoteFreeStructure;
    votingStructureIdVotingStructure[1] = singleVoteFreeStructure;

    VotingStructure memory singleVoteOneTokenPerVoteVotingStructure = VotingStructure(
        2,
        "SingleVote_OneTokenPerVote_VotingType",
        VoteCostType.OneTokenPerVote,
        address(this), // Set the token address for one token per vote
        1,
        1
    );
    votingTypeVotingStructure[uint(VotingTypes.SingleVote_OneTokenPerVote_VotingType)] = singleVoteOneTokenPerVoteVotingStructure;
    votingStructureIdVotingStructure[2] = singleVoteOneTokenPerVoteVotingStructure;
 

    VotingStructure memory limitlessTokenSameAsVoteVotingStructure = VotingStructure(
        3,
        "Limitless_TokenSameAsVote_VotingType",
        VoteCostType.SameAsVoteAmount,
        address(0), // Address of the token, set to zero address for free voting
        1,
        0 // No upper limit
    );
    votingTypeVotingStructure[uint(VotingTypes.Limitless_TokenSameAsVote_VotingType)] = limitlessTokenSameAsVoteVotingStructure;
    votingStructureIdVotingStructure[3] = limitlessTokenSameAsVoteVotingStructure;

    // Initialize Numeric Range Voting Structure (1 to 10) with Same as Vote Amount
    VotingStructure memory limited1to10QuadraticVotingStructure = VotingStructure(
        4,
        "Limited_1_to_10_Quadratic_VotingType",
        VoteCostType.SameAsVoteAmount,
        address(this), // Set the token address for same as vote amount
        1,
        10
    );
    votingTypeVotingStructure[uint(VotingTypes.Limited_1_to_10_Quadratic_VotingType)] = limited1to10QuadraticVotingStructure;
    votingStructureIdVotingStructure[4] = limited1to10QuadraticVotingStructure;

   
}

    constructor(string[] memory chainNamesInput, uint256[] memory chainIds) {
        require(chainNamesInput.length == chainIds.length, "Array lengths must match");
        //@todo votingstructures can also be provided as input
        initializeChains(chainNamesInput, chainIds);
        initializeVotingStructures();
      
    }
    
    function setBridgeImplementation(
        uint256 fromChainId,
        uint256 toChainId,
        address bridgeImplAddress
    ) external onlyOwner {
        bytes32 key = keccak256(abi.encodePacked(fromChainId, toChainId));
        bridgeImplementations[key] = bridgeImplAddress;
    }

    function getBridgeImplementation(
        uint256 fromChainId,
        uint256 toChainId
    ) public view override returns (address) {
        if (fromChainId == toChainId) {
            return address(0);
        } else {
            // Replace the following with the actual logic for determining the bridge contract address
            // For example, you could use a mapping to store the bridge contract addresses for different chain pairs
            bytes32 key = keccak256(abi.encodePacked(fromChainId, toChainId));

            return bridgeImplementations[key];
        }
    }

    function getChainId() public view override returns (uint256) {
        uint256 id;
        assembly {
            id := chainid()
        }
        return id;
    }
    uint private nonce = 0;
    uint private constant MAX_NONCE = 999999999999999999;
    
    function generateUniqueId() public returns (uint) {
        uint id = (block.timestamp * 1000000000000000000) + nonce;
        nonce = (nonce + 1) % MAX_NONCE;
        return id;
    }

    function getChainName(
        uint256 chainId
    ) public view override returns (string memory) {
        return chainNames[chainId];
    }

    function _authorizeUpgrade(
        address newImplementation
    ) internal virtual {}

    function getVotingStructures()
        external
        view
        override
        returns (uint[] memory, VotingStructure[] memory)
    {    uint[] memory keys = new uint[](NUMBEROFVOTINGSTRUCTURES);
        VotingStructure[] memory values = new VotingStructure[](NUMBEROFVOTINGSTRUCTURES);

        uint index = 0;
        for (uint i = 0; i < NUMBEROFVOTINGSTRUCTURES; i++) {
          //  if (votingTypeVotingStructure[i].exists) {
                keys[index] = i;
                values[index] = votingTypeVotingStructure[i];
                index++;
         //   }
        }

        return (keys, values);
    }
    function getVotingStructuresById()
        external
        view
        override
        returns (uint[] memory, VotingStructure[] memory)
    {    uint[] memory keys = new uint[](NUMBEROFVOTINGSTRUCTURES);
        VotingStructure[] memory values = new VotingStructure[](NUMBEROFVOTINGSTRUCTURES);

        uint index = 0;
        for (uint i = 0; i < NUMBEROFVOTINGSTRUCTURES; i++) {
                keys[index] = i+1;
                values[index] = votingStructureIdVotingStructure[i];
                index++;
        }

        return (keys, values);
    }
}