// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../storage/IHasUpgradableEternalStorage.sol";
//import "./IUtilityImpl.sol";
import { IUtilityImpl as MyIUtilityImpl } from "./IUtilityImpl.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
//import "dotenv";

//import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
//import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";


contract UtilityImpl is OwnableUpgradeable, MyIUtilityImpl {

    enum VotingTypes {
        YesNoVotingType,
        YesNoOneTokenPerVote,
        NumericRangeFree,
        NumericRangeSameAsVoteAmount,
        LimitlessSameAsVoteAmount
    }


    mapping(uint => VotingStructure) public votingTypeVotingStructure; //VotingType to VotingStructure
    mapping(uint => string) public chainNames; //chainId to chainName
    mapping(bytes32 => address) public bridgeImplementations;

    enum  chainNamesEnum  { Ethereum_main_network, Ethereum_classic_main_network, Hardhat, Ganache, Goerli, Palm_testnet, Aurora_testnet }

    mapping(chainNamesEnum => uint) public chainEnumToIds;
    mapping(chainNamesEnum => string) public chainEnumToChainName;
    uint NUMBEROFVOTINGSTRUCTURES = 5; 
    function initializeVotingStructures() internal {
    // Initialize Yes/No Voting Structure
    string[] memory yesNoCategories = new string[](2);
    yesNoCategories[0] = "No";
    yesNoCategories[1] = "Yes";
    VotingStructure memory yesNoVotingStructure = VotingStructure(yesNoCategories, 
        VoteCostType.Free,
        address(0), // Address of the token, set to zero address for free voting
        0,
        1
    );
    votingTypeVotingStructure[uint(VotingTypes.YesNoVotingType)] = yesNoVotingStructure;

    // Initialize Yes/No Voting Structure with One Token per Vote
    VotingStructure memory yesNoOneTokenVotingStructure = VotingStructure(yesNoCategories, 
        VoteCostType.OneTokenPerVote,
        address(this), // Set the token address for one token per vote
        0,
        1
    );
    votingTypeVotingStructure[uint(VotingTypes.YesNoOneTokenPerVote)] = yesNoOneTokenVotingStructure;

    string[] memory oneToTenVotingCategoryNames = new string[](10);
    oneToTenVotingCategoryNames[0] = "One";
    oneToTenVotingCategoryNames[1] = "Two";
    oneToTenVotingCategoryNames[2] = "Three";
    oneToTenVotingCategoryNames[3] = "Four";
    oneToTenVotingCategoryNames[4] = "Five";
    oneToTenVotingCategoryNames[5] = "Six";
    oneToTenVotingCategoryNames[6] = "Seven";
    oneToTenVotingCategoryNames[7] = "Eight";
    oneToTenVotingCategoryNames[8] = "Nine";
    oneToTenVotingCategoryNames[9] = "Ten";    

    // Initialize Numeric Range Voting Structure (1 to 10) with Free Voting
    VotingStructure memory numericRangeFreeVotingStructure = VotingStructure(oneToTenVotingCategoryNames, 
        VoteCostType.Free,
        address(0), // Address of the token, set to zero address for free voting
        1,
        10
    );
    votingTypeVotingStructure[uint(VotingTypes.NumericRangeFree)] = numericRangeFreeVotingStructure;

    // Initialize Numeric Range Voting Structure (1 to 10) with Same as Vote Amount
    VotingStructure memory numericRangeSameAmountVotingStructure = VotingStructure(oneToTenVotingCategoryNames, 
        VoteCostType.SameAsVoteAmount,
        address(this), // Set the token address for same as vote amount
        1,
        10
    );
    votingTypeVotingStructure[uint(VotingTypes.NumericRangeSameAsVoteAmount)] = numericRangeSameAmountVotingStructure;

    string[] memory oneValueCategoryNames = new string[](1);
    oneValueCategoryNames[0] = "Vote_Val";
    // Initialize Limitless Voting Structure with Same as Vote Amount
    VotingStructure memory limitlessSameAmountVotingStructure = VotingStructure(oneValueCategoryNames,
        VoteCostType.SameAsVoteAmount,
        address(this), // Set the token address for same as vote amount
        0,
        0 // No upper limit
    );
    votingTypeVotingStructure[uint(VotingTypes.LimitlessSameAsVoteAmount)] = limitlessSameAmountVotingStructure;
}

    constructor(string[] memory chainNamesInput, uint256[] memory chainIds) {
        require(chainNamesInput.length == chainIds.length, "Array lengths must match");
    
        for (uint256 i = 0; i < chainNamesInput.length; i++) {
            chainEnumToChainName[chainNamesEnum(i)] = chainNamesInput[i];
            chainNames[i] = chainNamesInput[i];
            chainEnumToIds[chainNamesEnum(i)] = chainIds[i];
        }
        // Fill the VotingTypes enum
        // Note: You should only initialize the enum values in the constructor
        // if you know all the possible values ahead of time.
        // If you need to add new enum values at runtime, you should use an upgradeable contract pattern.


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
}
