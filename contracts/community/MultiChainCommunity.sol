// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "../utility/UtilityProxy.sol";
import "../utility/IUtilityImpl.sol";
import "../utility/UtilityImpl.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import { IDecisionManagementImpl as MyIDecisionManagementImpl } from "../genericMultiChainDecisionManagement/IDecisionManagementImpl.sol";

import "../genericMultiChainDecisionManagement/DecisionManagementProxy.sol";

contract MultiChainCommunity is Ownable {
   
    //IUtilityImpl.CommunityData public communityData;
    string public communityDataJson;
    string public operation;
    string public operationAccount;
    string public operationChainID;
    string public operationTags;
    uint256 id;
    address parentCommunityAddress;
    uint parentCommunityId;
    string name;
    //IUtilityImpl.AccountChainPair[] members;
    address[] memberAccounts;
    uint256[] memberChainIds;
    string[][] memberTags;
    mapping(uint256 => uint256) chainWeights; //chainId =>chainweight
    mapping(bytes => uint256) chainProposalWeights; //keccak (chainId + proposalId) =>chainProposalweight
    mapping(address => mapping(address => uint256)) public memberTokenBalances;
    MyIDecisionManagementImpl public decisionManagerImpl;
    UtilityImpl utilityImpl;
    string public denemeString;
    // Declare the communityDataJson variable

    uint communityDataMembersSlot;
    uint memberTokenBalancesSlot;
    string currentChainName;
    uint currentChainId;

    constructor(uint communityId,string memory communityName, address _utilityProxyAddress, address _decisionManagerProxyAddress,address _parentCommunityAddress, uint _parentCommunityId,string[] memory _tags, uint chainID, string memory chainName) {
        utilityImpl = UtilityImpl(UtilityProxy(payable(_utilityProxyAddress)).implementation.address);
        decisionManagerImpl = MyIDecisionManagementImpl(DecisionManagementProxy(payable(_decisionManagerProxyAddress)).implementation.address);
        if (_parentCommunityAddress != address(0)){
            parentCommunityId = _parentCommunityId;   
            parentCommunityAddress = _parentCommunityAddress; 
        }
        name = communityName;

        //id = utilityImpl.generateUniqueId();
        id = communityId;

        currentChainId = chainID;//utilityImpl.getChainId{gas: 1000000}();
        currentChainName = chainName; //utilityImpl.getChainName{gas: 1000000}(currentChainId);
        setChainDefaultWeight(currentChainId, 2);
        require(msg.sender != address(0), "Invalid account address");
        require(currentChainId > 0, "Invalid chain ID");
        require(_tags.length > 0, "At least one tag is required");
        // Add the owner as a member in members
        memberAccounts.push(msg.sender);
        memberChainIds.push(currentChainId);
        memberTags.push(_tags);
        //communityDataJson = string(abi.encodePacked(communityDataJson, "+", "|", addressToString(msg.sender), "|", uintToString(currentChainId), "|", tags)) gas(1000000);
        communityDataJson = string.concat(communityDataJson, "+");
        communityDataJson = string.concat(communityDataJson, "|");
        communityDataJson = string.concat(communityDataJson, addressToString(msg.sender));
        communityDataJson = string.concat(communityDataJson, "|");
        communityDataJson = string.concat(communityDataJson, uintToString(currentChainId));        
        communityDataJson = string.concat(communityDataJson, "|");
        operation = "+";
        operationAccount = addressToString(msg.sender);

                
    }
    function bytesToHex(bytes memory data) internal pure returns (string memory) {
        bytes memory hexChars = "0123456789abcdef";
        bytes memory hexData = new bytes(2 * data.length);

        for (uint256 i = 0; i < data.length; i++) {
            uint8 value = uint8(data[i]);
            hexData[2 * i] = hexChars[value >> 4];
            hexData[2 * i + 1] = hexChars[value & 0x0f];
        }

    return string(hexData);
    }
    function getCommunityBalance(IERC20 tokenAddress) public view returns(uint256) {
       return tokenAddress.balanceOf(address(this));
   }
   function getSlotNumbers() public pure returns(uint256 slotA, uint256 slotB) {
       //IUtilityImpl.AccountChainPair[] storage members = communityData.members;
        /*assembly {
            slotA := memberAccounts.slot
            slotB := memberTokenBalances.slot
    
        }*/
        return(slotA, slotB);
    }
   function withdrawERC20TokenFrom(IERC20 tokenAddress, uint256 amount) public {
        require(amount <= tokenAddress.balanceOf(address(this)), "Insufficient token balance");
        require(amount <= memberTokenBalances[msg.sender][address(tokenAddress)], "Insufficient token balance");
        memberTokenBalances[msg.sender][address(tokenAddress)] -= amount;
        tokenAddress.transfer(msg.sender, amount);
        
        //emit TokenTransferred(tokenAddress, msg.sender, amount);   
    }

    function isERC20(address token) internal view returns (bool) {
        bytes4 interfaceId = 0x95d89b41; // bytes4(keccak256("totalSupply()"))
        (bool success, bytes memory result) = token.staticcall(abi.encodeWithSelector(interfaceId));
        return success && result.length > 0;
    }
    function contribute(address token, uint256 amount) external {
        // Transfer the tokens from the contributor to the contract
        require(isERC20(token), "Only ERC20 contributions allowed");

        require(IERC20(token).transferFrom(msg.sender, address(this), amount), "Token transfer failed");

        // Add the contribution to the member's token balance
        memberTokenBalances[msg.sender][token] += amount;

        // Perform any other necessary actions
    }

    function getMemberTokenContribute(address member, address token) public view returns(uint256) {
        return memberTokenBalances[member][token];
    }

    function test() public pure returns (string memory) {
        return "Hello";
    }

    event DenemeWithParam(string param);
    function denemeWithoutParam() public returns (string memory result) {
        console.log("denemeWithoutParam function is executed");
        emit DenemeWithParam("Hello");
        console.log("DenemeWithParam Emitted", "Hello");
        return "denemeWithout Param Executed";
    }
    event DenemeWithOutParam(string param);

    function denemeWithParam(string calldata param) public returns (string memory result) {
        emit DenemeWithParam(param);
        denemeString = "param";
        console.log("DenemeWithParam Emitted", param);
        return "denemeWith Param Executed";
    }  

    event MemberAdded(address account, uint chainId, string[] tags);
    function addMember(address account, uint chainId, string[] memory tags)public onlyOwner returns (string memory result) {
        console.log('Adding member');
        
        require(account != address(0), "Invalid account address");
        require(chainId > 0, "Invalid chain ID");
        require(tags.length > 0, "At least one tag is required");
        memberAccounts.push(msg.sender);
        memberChainIds.push(utilityImpl.getChainId());
        memberTags.push(tags);
        communityDataJson = string(abi.encodePacked(communityDataJson, "+", "|", addressToString(account), "|", uintToString(chainId), "|"));
        console.log('MemberAdded event emitted');                
        emit MemberAdded(account, chainId, tags);
        return "Ekledim";
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
    function removeMember(address account, uint chainId) public onlyOwner returns (string memory result) {
        console.log('Removing member');

        uint256 indexToRemove;
        //for (uint256 i = 0; i < communityData.members.length; i++) {        
        for (uint256 i = 0; i < memberAccounts.length; i++) {
            if (memberAccounts[i] == account && memberChainIds[i] == chainId ) {
            indexToRemove = i;
            break;
            }
        }
        
        memberAccounts[indexToRemove] = memberAccounts[memberAccounts.length - 1];       
        memberAccounts[indexToRemove] = memberAccounts[memberAccounts.length - 1];         
        memberAccounts.pop();        


        memberChainIds[indexToRemove] = memberChainIds[memberChainIds.length - 1];       
        memberChainIds[indexToRemove] = memberChainIds[memberChainIds.length - 1];         

        memberChainIds.pop();    

        memberTags[indexToRemove] = memberTags[memberTags.length - 1];       
        memberTags[indexToRemove] = memberTags[memberTags.length - 1];         

        memberTags.pop();    
        //communityDataJson = string(abi.encodePacked(communityDataJson, "-", "|", addressToString(account), "|", uintToString(chainId), "|"));
        emit MemberRemoved(account, chainId);
        console.log('MemberRemoved event emitted');
        return "Cikardim";
    }
    
    function initializeAllChainDefaultWeights(uint value) public onlyOwner{
        for (uint8 chainId= uint8(UtilityImpl.chainNamesEnum.Ethereum_main_network); chainId < uint8(UtilityImpl.chainNamesEnum.Ethereum_classic_main_network); chainId++){
            chainWeights[chainId] = value;
            }
    }
    function setChainDefaultWeight(uint chainId, uint256 weight) public onlyOwner{
        chainWeights[chainId] = weight;
    }
    function setChainProposalWeight(uint chainId, uint proposalId, uint256 weight) public onlyOwner{
        bytes memory key = abi.encodePacked(chainId, proposalId);
        chainProposalWeights[key] = weight;
    }
    function isMember(address account, uint chainId) public view returns (bool) {
        for (uint i = 0; i < memberAccounts.length; i++) {
            if (memberAccounts[i] == account && memberChainIds[i] == chainId) {
                return true;
            }
        }
    return false;
}

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
    )  public returns (uint256) {
    uint256 proposalId = decisionManagerImpl.createProposal(
            _description,
            _communityId,
            _communityName,
            _proposingMemberAddress,
            _proposingMemberChainId,
            _communityRestriction,
            _votingStructure,
            _proposalBudget,
            _quorum,
            _startTime,
            _endTime,
            _proposalImplementationAddress, 
            _tags
        );

        return proposalId;
    }


    event TokenTransferred(
        address tokenAddress,
        address senderAddress,
        uint256 amount
    );



    function voteForAProposal(uint256 proposalIdInput, uint numericValue,  bool yesno ) public {
        IUtilityImpl.ProposalBasicData memory proposalBasicData = decisionManagerImpl.getProposalBasicInfoAndContraintsWithoutVotesById(proposalIdInput);

        // Check if the voter is a member of the community
        require( isMember(msg.sender, utilityImpl.getChainId()), "Not a member of the community.");


        // Check if the chain of the voter has voting weight
        //require(communityData.chainWeights[utilityImpl.getChainId()] > 0 || communityData.chainProposalWeights[abi.encodePacked(utilityImpl.getChainId(), proposalId)] > 0, "Voting weight of the chain is 0.");
        require(chainWeights[utilityImpl.getChainId()] > 0 || chainProposalWeights[abi.encodePacked(utilityImpl.getChainId(), proposalBasicData.proposalId)] > 0, "Voting weight of the chain is 0.");
     


        require(proposalBasicData.proposalCommunityRestriction == uint(IUtilityImpl.CommunityRestriction.All) ||
                (proposalBasicData.proposalCommunityRestriction == uint(IUtilityImpl.CommunityRestriction.OnlyProposingCommunity) && proposalBasicData.proposingCommunityId == id) ||
                (proposalBasicData.proposalCommunityRestriction == uint(IUtilityImpl.CommunityRestriction.OnlyProposingAndChildren) && (proposalBasicData.proposingCommunityId == id || proposalBasicData.proposingCommunityId == parentCommunityId) ||
                (proposalBasicData.proposalCommunityRestriction == uint(IUtilityImpl.CommunityRestriction.OnlyChildren) && proposalBasicData.proposingCommunityId == parentCommunityId) ||
                (proposalBasicData.proposalCommunityRestriction == uint(IUtilityImpl.CommunityRestriction.NotProposingCommunity) && proposalBasicData.proposingCommunityId != id)),
                "Caller is not eligible to vote for this proposal due to proposal community restrictions."
            );
        //uint256 chainCurrentVotingWeight = communityData.chainWeights[utilityImpl.getChainId()];
        uint256 chainCurrentVotingWeight = chainWeights[utilityImpl.getChainId()];        
        IUtilityImpl.Vote memory vote;
        vote.voteId = utilityImpl.generateUniqueId();
        vote.proposalId = proposalBasicData.proposalId;
        vote.yesno = yesno;
        vote.numericValue = numericValue;
        vote.voterAddress = msg.sender;
        vote.voterChainId = utilityImpl.getChainId();
        vote.chainCurrentVotingWeight = chainCurrentVotingWeight;


        decisionManagerImpl.vote(vote, id);
    }
/*
    function stringify(IUtilityImpl.CommunityData storage data) internal view returns (string memory) {
    string memory fieldDelimiter = "|";
    string memory memberDelimiter = ",";
    string memory result = "";

    // Append the fields with the field delimiter
    result = string(abi.encodePacked(result, uintToString(data.id), fieldDelimiter));
    result = string(abi.encodePacked(result, data.name, fieldDelimiter));

    // Append the members array with the member delimiter
    for (uint256 i = 0; i < data.members.length; i++) {
        //string memory tagsString = string(abi.encodePacked('"', stringJoin(data.members[i].tags, ","), '"'));
    
        result = string(abi.encodePacked(result, addressToString(data.members[i].account), memberDelimiter));
        result = string(abi.encodePacked(result, uintToString(data.members[i].chainId), memberDelimiter));
        //result = string(abi.encodePacked(result, tagsString, memberDelimiter));
    }

    return result;
}*/
/*
 function jsonEncode(IUtilityImpl.CommunityData storage data) internal view returns (string memory) {
    string memory jsonString = '{';
    jsonString = string(abi.encodePacked(jsonString, '"id": ', uintToString(data.id), ', '));
    jsonString = string(abi.encodePacked(jsonString, '"name": "', data.name, '", '));
    
    // Encode the members array
    jsonString = string(abi.encodePacked(jsonString, '"members": ['));
    
    for (uint256 i = 0; i < data.members.length; i++) {
        string memory tagsString = string(abi.encodePacked('"', stringJoin(data.members[i].tags, ","), '"'));
    
        jsonString = string(abi.encodePacked(
            jsonString,
            '{"address": "', addressToString(data.members[i].account), '", ',
            '"chainId": ', uintToString(data.members[i].chainId), ', ',
            '"tags": "', tagsString, '"',
            '}'
        ));
        
        if (i < data.members.length - 1) {
            jsonString = string(abi.encodePacked(jsonString, ', '));
        }
    }
    
    jsonString = string(abi.encodePacked(jsonString, ']'));
    jsonString = string(abi.encodePacked(jsonString, '}'));
    
    return jsonString;
}
*/
// Helper functions for converting values to string
/*function stringJoin(string[] memory strings, string memory delimiter) internal pure returns (string memory) {
    if (strings.length == 0) {
        return "";
    }
    
    string memory joinedString = strings[0];
    for (uint256 i = 1; i < strings.length; i++) {
        joinedString = string(abi.encodePacked(joinedString, delimiter, strings[i]));
    }
    
    return joinedString;
}
*/
function uintToString(uint256 value) internal pure returns (string memory) {
    return Strings.toString(value);
}

function addressToString(address value) internal pure returns (string memory) {
    return Strings.toHexString(uint256(uint160(value)));
}

}