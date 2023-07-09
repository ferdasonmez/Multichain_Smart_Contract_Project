// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

//import IpfsWriter from "ipfs://QmT2v6T7U6cMJU6wV7f8yvQ2K7PbGhLSSc7mGEZmP5V7yt/IpfsWriter.sol";

//import "@hardhat-IPFS/*";

contract IPFSFunctionCallQueue {
    struct FunctionCall {
        bytes4 sig;
        bytes data;
        address contractAddress;
        uint256 chainId;
        uint256 requestId;
        uint8 status;
    }

    // List of function calls to execute
    FunctionCall[] functionCalls;
    
    // The IPFSWriter contract address
    address public ipfsWriterAddress;

    constructor(address _ipfsWriterAddress) {
        ipfsWriterAddress = _ipfsWriterAddress;
    }

    function addFunctionCall(bytes4 _sig, bytes calldata _data, address _contractAddress, uint256 _chainId, uint256 _requestId) external {
        functionCalls.push(FunctionCall(_sig, _data, _contractAddress, _chainId, _requestId, 0));
        uint index = functionCalls.length - 1;
        //IpfsWriter(ipfsWriterAddress).write(abi.encodePacked(index, _sig, _data, _contractAddress, _chainId, _requestId, 0));
    }

    function getFunctionCall(uint256 _index) external view returns (FunctionCall memory) {
        return functionCalls[_index];
    }
}
