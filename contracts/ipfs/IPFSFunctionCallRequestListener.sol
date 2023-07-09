// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "./IPFSReader.sol";
//import { IpfsContent } from 'ipfs-core-utils/contracts/IpfsContent.sol';
//import { IpfsStorage } from 'ipfs-core-utils/contracts/IpfsStorage.sol';

contract IPFSFunctionCallRequestListener is IPFSReader {
    uint256 public callInterval; // Interval between function calls in seconds
    mapping(bytes32 => bool) public executedFunctionCalls; // Mapping to track executed function calls

    event FunctionCalled(bytes32 indexed hash);
    uint256 lastRun;
    constructor(uint256 _callInterval, string memory _ipfsGateway) IPFSReader(_ipfsGateway) {
        callInterval = _callInterval;
        lastRun = block.timestamp;
        startListening();
    }

   function startListening() public {
        require(block.timestamp - lastRun > callInterval, 'Need to wait time interval minutes');
        bytes32[] memory callList = getFunctionCallsFromIPFS();
        for(uint i = 0; i < callList.length; i++) {
            bytes32 data = callList[i];
            //(address target, bytes memory payload) = abi.decode(ipfsGetData(data), (address, bytes));
            require(!executedFunctionCalls[data], "Function already executed");
            //(bool success, ) = target.call(payload);
            bool success = true;
            executedFunctionCalls[data] = true;
            require(success, "Function call failed");
            emit FunctionCalled(data);
        }
        lastRun = block.timestamp;
    }
    function getFunctionCallsFromIPFS() internal returns (bytes32[] memory) {
        //bytes memory ipfsData = ipfsGetData(ipfsHash); // replace ipfsHash with the IPFS hash of the function calls
        bytes memory ipfsData;
        return abi.decode(ipfsData, (bytes32[]));
    }
    function updateCallInterval(uint256 _newInterval) external {
        require(_newInterval > 0, "Interval must be greater than 0");
        callInterval = _newInterval;
    }

    function updateIPFSGateway(string calldata _ipfsGateway) external {
        setIPFSGateway(_ipfsGateway);
    }

    function getNextCallTime() public view returns (uint256) {
        return block.timestamp + callInterval;
    }

    function getExecutedHash(bytes32 _hash) public view returns (bool) {
        return executedFunctionCalls[_hash];
    }
}
