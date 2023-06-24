// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./GenericBridgeImpl.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../utility/IUtilityImpl.sol";
//import "./hop_protocol_contracts/HopBridge.sol";
abstract contract ToXDAIBridgeImpl is GenericBridgeImpl {
    // address of the TokenBridge contract on xDai network
    //address constant private HOP_BRIDGE_XDAI_ADDRESS = 0xD407Ef3055203eE9a6Aa8aFf84682f1928aE9F2a;
    uint256 xDAIChainID = 100;
    //IUtilityImpl utilityImpl;

    constructor(
        address _utilityProxyAddress,
        string memory currentChainName,
        string memory targetChainName,
        uint256 currentChainID,
        uint256 targetChainID,
        address bridge_address
    ) {
        //UtilityProxy proxy = UtilityProxy(payable(_utilityProxyAddress));
        //UtilityImpl utilityImpl = IUtilityImpl(proxy.implementationAddress());

        if(keccak256(abi.encodePacked(currentChainName)) == keccak256(abi.encodePacked("")))
            currentChainName = utilityImpl.getChainName(utilityImpl.getChainId());
        if (currentChainID == 0)
            currentChainID = utilityImpl.getChainId();

        if (keccak256(abi.encodePacked(targetChainName)) == keccak256(abi.encodePacked("")))
            targetChainName = utilityImpl.getChainName(xDAIChainID);

        if (targetChainID == 0) 
            targetChainID = xDAIChainID;
        

        //require(currentChainID == utilityImpl.getChainId(), "Bridge source Chain ID does not suit current chain");
        bridgeInfo = BridgeInfo(currentChainName, targetChainName, currentChainID, targetChainID);
        utilityImpl.setBridgeImplementation(currentChainID, targetChainID, address(this));
    
       /* super(
            _utilityProxyAddress,
            currentChainName,
            targetChainName,
            currentChainID,
            targetChainID
        );*/
    }

    
    function callForTargetChain(
        IUtilityImpl.ContractFunctionCallData calldata functionCallInfo
    ) public override returns (bytes memory) {
        bytes memory returnValue;
        // Construct the function signature
        //To be implemented
        /* address _targetContractAddress = contractCallData.targetContractAddress;
        string memory _targetFunctionName = contractCallData.targetfunctionName;
        bytes memory _functionParams = contractCallData.parameters;
        bytes memory functionSignature = abi.encodeWithSignature(_targetFunctionName, _functionParams);

        // Call the hop function on the HopBridge contract
        HopBridge bridge = new HopBridge();
        bridge.hop(_targetContractAddress, functionSignature);*/
        return returnValue;
    }



    // implementation logic for transferring funds to the target chain
    function makeTransferToTargetChain(
        IUtilityImpl.TransferData calldata transferDetails
    ) public override returns (bool) {
        //To be implemented
        // get the TokenBridge contract on the Ethereum network
        /*IERC20 token = IERC20(transferDetails.token);
        require(token.approve(HOP_BRIDGE_XDAI_ADDRESS, transferDetails.amount), "Failed to approve tokens for transfer");

        // transfer tokens to the TokenBridge contract
        require(HopBridge(HOP_BRIDGE_XDAI_ADDRESS).depositTokens(
            address(token),
            transferDetails.amount,
            transferDetails.recipient
        ), "Failed to deposit tokens");*/

        return true;
    }

}
