// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "../utility/UtilityProxy.sol";
import "../utility/IUtilityImpl.sol";
import "../utility/UtilityImpl.sol";
import { IDecisionManagementImpl as MyIDecisionManagementImpl } from "../genericMultiChainDecisionManagement/IDecisionManagementImpl.sol";

import "../genericMultiChainDecisionManagement/DecisionManagementProxy.sol";

contract MultiChainCommunity is Ownable {
   
    IUtilityImpl.CommunityData public communityData;
    MyIDecisionManagementImpl public decisionManagerImpl;
    UtilityImpl utilityImpl;

    constructor(string memory name, address _utilityProxyAddress, address _decisionManagerProxyAddress) {
        utilityImpl = UtilityImpl(UtilityProxy(payable(_utilityProxyAddress)).implementation.address);
        decisionManagerImpl = MyIDecisionManagementImpl(DecisionManagementProxy(payable(_decisionManagerProxyAddress)).implementation.address);
        communityData.name = name;
    }

    function getCommunityBalance(IERC20 tokenAddress) public view returns(uint256) {
       return tokenAddress.balanceOf(address(this));
   }
   
   function withdrawERC20TokenFrom(IERC20 tokenAddress, uint256 amount) public {
        require(amount <= tokenAddress.balanceOf(address(this)), "Insufficient token balance");
        tokenAddress.transfer(msg.sender, amount);
    
        //emit TokenTransferred(tokenAddress, msg.sender, amount);   
    }

    function test() public pure returns (string memory) {
        return "Hello";
    }

    event DenemeWithParam(string param);
    function denemeWithoutParam() public{
        emit DenemeWithParam("Hello");
    }
        event DenemeWithOutParam(string param);
    function denemeWithParam(string calldata param) public{
        emit DenemeWithParam(param);
    }  
    event MemberAdded(address account, uint chainId, string[] tags);
    function addMember(address account, uint chainId, string[] calldata tags) public onlyOwner {
        console.log('Adding member');
        require(account != address(0), "Invalid account address");
        require(chainId > 0, "Invalid chain ID");
        require(tags.length > 0, "At least one tag is required");
        communityData.members.push(IUtilityImpl.AccountChainPair(account, chainId, tags));


        emit MemberAdded(account, chainId, tags);
        console.log('MemberAdded event emitted');
    }

    function compareTags(string[] memory a, string[] memory b) private pure returns (bool) {
    if (a.length != b.length) {
        return false;
    }
    for (uint256 i = 0; i < a.length; i++) {
        if (keccak256(bytes(a[i])) != keccak256(bytes(b[i]))) {
            return false;
        }
    }
    return true;    
    }

    event MemberRemoved(address account, uint chainId);
    function removeMember(address account, uint chainId, string[]calldata tags) public onlyOwner{
        console.log('Removing member');

        uint256 indexToRemove;
        for (uint256 i = 0; i < communityData.members.length; i++) {
        if (communityData.members[i].account == account && communityData.members[i].chainId == chainId && compareTags(communityData.members[i].tags, tags)) {
            indexToRemove = i;
            break;
            }
        }
        communityData.members[indexToRemove] = communityData.members[communityData.members.length - 1];
        communityData.members.pop();
        //if (indexToRemove > -1) {
        //    communityData.members.splice(indexToRemove, 1);
        //}
        //communityData.members.pop(IUtilityImpl.AccountChainPair(account, chainId, tags));
    emit MemberRemoved(account, chainId);
    console.log('MemberRemoved event emitted');
    }
    
    function initializeAllChainDefaultWeights(uint value) public onlyOwner{
        for (uint8 chainId= uint8(UtilityImpl.chainNamesEnum.Ethereum_main_network); chainId < uint8(UtilityImpl.chainNamesEnum.Ethereum_classic_main_network); chainId++){
            communityData.chainWeights[chainId] = value;
            }
    }
    function setChainDefaultWeight(uint chainId, uint256 weight) public onlyOwner{
        communityData.chainWeights[chainId] = weight;
    }
    function setChainProposalWeight(uint chainId, uint proposalId, uint256 weight) public onlyOwner{
        bytes memory key = abi.encodePacked(chainId, proposalId);
        communityData.chainProposalWeights[key] = weight;
    }
    function makeProposal(string calldata description,  uint256 _votingType,
        IUtilityImpl.VotingStructure calldata _votingStructure,
        uint256 _startTime,
        uint256 _endTime,
        address _proposalImplementationAddress) public returns(uint256) {
        // Check if the proposer is a member of the community
        bool isMember = false;
        for (uint i = 0; i < communityData.members.length; i++) {
            if (communityData.members[i].account == msg.sender) {
                isMember = true;
                break;
            }
        }
        require(isMember, "Not a member of the community.");


        uint256 proposalId = decisionManagerImpl.createProposal(description, _votingType, _votingStructure, _startTime, _endTime, _proposalImplementationAddress);
        return proposalId;
    }

    event TokenTransferred(
        address tokenAddress,
        address senderAddress,
        uint256 amount
    );



    function voteForAProposal(uint256 proposalId, IUtilityImpl.VoteValue [] calldata voteValues ) public {
        // Check if the voter is a member of the community
        bool isMember = false;
        IUtilityImpl.AccountChainPair memory accountChainPair;
        for (uint i = 0; i < communityData.members.length; i++) {
            if (communityData.members[i].account == msg.sender && communityData.members[i].chainId == utilityImpl.getChainId() ) {
                isMember = true;
                accountChainPair = communityData.members[i];
                break;
            }
        }
        require(isMember, "Not a member of the community.");

        // Check if the chain of the voter has voting weight
        require(communityData.chainWeights[accountChainPair.chainId] > 0 || communityData.chainProposalWeights[abi.encodePacked(accountChainPair.chainId, proposalId)] > 0, "Voting weight of the chain is 0.");

        uint256 chainCurrentVotingWeight = communityData.chainWeights[utilityImpl.getChainId()];
        IUtilityImpl.Vote memory vote;
        vote.proposalId = proposalId;
        vote.voteValues = voteValues;
        vote.voterAddress = msg.sender;
        vote.voterChainId = utilityImpl.getChainId();
        vote.chainCurrentVotingWeight = chainCurrentVotingWeight;




        decisionManagerImpl.vote(proposalId, vote);
    }
}