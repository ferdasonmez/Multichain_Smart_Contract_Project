// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/proxy/ERC1967/ERC1967Upgrade.sol";
import "@openzeppelin/contracts/proxy/utils/Initializable.sol";
import "./../utility/IUtilityImpl.sol";
import { UtilityImpl as MyUtilityImpl } from "./../utility/UtilityImpl.sol";
//import "./../utility/UtilityImpl.sol";
import "./../utility/UtilityProxy.sol";

contract MultiChainOracleSmartContract is Initializable {

    address proxyImplementationAddress;

    IUtilityImpl utilityImpl;
    constructor(address _utilityProxyAddress ) {
        UtilityProxy proxy = UtilityProxy(payable(address(_utilityProxyAddress)));
        proxyImplementationAddress = proxy.getImplementation();
        utilityImpl = MyUtilityImpl(proxyImplementationAddress);
        //utilityImpl = IUtilityImpl(UtilityProxy(_utilityProxyAddress).implementation());

    }    
     event VoteProcessRequest(string, string);
    
    function processVotesOffChain(IUtilityImpl.Proposal storage proposal) internal {
        

        // Convert proposal data to JSON string
        string memory json = convertProposalToJson(proposal);

        // Make HTTP request to server with JSON data
        //string memory url = string(abi.encodePacked("http://", serverIp, "/vote"));
        string memory event_type = "process_votes";
        /*bool success; 
        bytes memory response;  
        
        string memory json_event_data = json;*/
        emit VoteProcessRequest(event_type, json);
    }
    /*function callHttp(string url, string json) public returns (bool, bytes memory) {
       // string memory url = "https://jsonplaceholder.typicode.com/todos/1";
        //string memory json = "";
        bool success; 
        bytes memory response;
       (success, response) = httpClient.post(url, json);
        require(success, "HTTP request failed");
        return (success, response);
    }*/

    function convertProposalToJson(IUtilityImpl.Proposal storage proposal) internal returns (string memory) {
        
         (uint[] memory votingStructureKeys, IUtilityImpl.VotingStructure[] memory votingStructureValues) = utilityImpl.getVotingStructures();
         //ferda @todo we may need to find the key and use it in values array
         IUtilityImpl.VotingStructure memory votingStructure = votingStructureValues[proposal.votingType];

        string[] memory voteCategoryNames = votingStructure.voteCategoryNames;
        IUtilityImpl.Vote[] memory votes = new IUtilityImpl.Vote[](proposal.numberOfVotes);
        
        for(uint i = 0; i < proposal.numberOfVotes; i++) {
            votes[i] = proposal.votes[keccak256(abi.encodePacked(proposal.proposingMemberAddress, proposal.proposingMemberChainId, i))];
        }
        
    bytes[] memory partBytes = new bytes[](11 + proposal.numberOfVotes * voteCategoryNames.length);
    uint index;

    partBytes[index++] = bytes('{');
    partBytes[index++] = bytes('"id":');
    partBytes[index++] = bytes(uint2str(proposal.id));
    partBytes[index++] = bytes(',"description":"');
    partBytes[index++] = bytes(proposal.description);
    partBytes[index++] = bytes('","proposingMemberAddress":"');
    partBytes[index++] = bytes(addressToString(proposal.proposingMemberAddress));
    partBytes[index++] = bytes('","proposingMemberChainId":');
    partBytes[index++] = bytes(uint2str(proposal.proposingMemberChainId));
    partBytes[index++] = bytes(',"votingType":');
    partBytes[index++] = bytes(uint2str(proposal.votingType));

    for(uint i = 0; i < proposal.numberOfVotes; i++) {
        partBytes[index++] = bytes(',"vote');
        partBytes[index++] = bytes(uint2str(i+1));
        partBytes[index++] = bytes('":[');

        for(uint j = 0; j < voteCategoryNames.length; j++) {
            if(j > 0) {
                partBytes[index++] = bytes(',');
            }
            partBytes[index++] = bytes('{"');
            partBytes[index++] = bytes(voteCategoryNames[j]);
            partBytes[index++] = bytes('":');
            partBytes[index++] = bytes(uint2str(votes[i].voteValues[j].voteValue));
            partBytes[index++] = bytes('}');
        }
        partBytes[index++] = bytes(']');
    }

    partBytes[index++] = bytes('}');
    bytes memory concatenated = concatenate(partBytes);
    return string(concatenated);

    }
    function concatenate(bytes[] memory parts) internal pure returns (bytes memory) {
    uint totalLength = 0;
    for(uint i = 0; i < parts.length; i++) {
        totalLength += parts[i].length;
    }

    bytes memory result = new bytes(totalLength);
    uint offset = 0;
    for(uint i = 0; i < parts.length; i++) {
        bytes memory part = parts[i];
        uint length = part.length;
        if(length > 0) {
            assembly {
                // Copy the bytes from `part` into `result`.
                // See https://solidity.readthedocs.io/en/v0.8.9/assembly.html#mload-mstore-and-mstore8
                let dest := add(add(result, 0x20), offset)
                let src := add(part, 0x20)
                let count := length
                for { } gt(count, 0) { } {
                    let value := mload(src)
                    mstore(dest, value)
                    offset := add(offset, 0x20)
                    count := sub(count, 0x20)
                    src := add(src, 0x20)
                }
            }
        }
    }

    return result;
}


    function uint2str(uint _i) internal pure returns (string memory _uintAsString) {
        if (_i == 0) {
            return "0";
        }
        uint j = _i;
        uint len;
        while (j != 0) {
            len++;
            j /= 10;
        }
        bytes memory bstr = new bytes(len);
        uint k = len;
        while (_i != 0) {
            k = k-1;
            uint8 temp = uint8(48 + _i % 10);
            bytes1 b1 = bytes1(temp);
            bstr[k] = b1;
            _i /= 10;
        }
        return string(bstr);
    }

    function addressToString(address _address) internal pure returns (string memory) {
        bytes32 value = bytes32(uint256(uint160(_address)));
        bytes memory alphabet = "0123456789abcdef";

        bytes memory str = new bytes(42);
        str[0] = '0';
        str[1] = 'x';
        for (uint i = 0; i < 20; i++) {
            str[2+i*2] = alphabet[uint(uint8(value[i + 12]) >> 4)];
            str[3+i*2] = alphabet[uint(uint8(value[i + 12]) & 0x0f)];
        }
        return string(str);
    }
}