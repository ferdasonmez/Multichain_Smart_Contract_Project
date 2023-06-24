// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./GenericBridgeImpl.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../utility/IUtilityImpl.sol";


abstract contract ToETHBridgeImpl is GenericBridgeImpl {
    // address of the TokenBridge contract on Ethereum network
    address constant private HOP_BRIDGE_ETH_ADDRESS = 0x4C36d2919e407f0Cc2Ee3c993ccF8ac26d9CE64e;


    uint256 ethChainID = 1;   


    constructor (address _utilityProxyAddress, string memory currentChainName,  string memory targetChainName, 
    uint256 currentChainID, uint256 targetChainID) {

        if(keccak256(abi.encodePacked(currentChainName)) == keccak256(abi.encodePacked("")))
            currentChainName = utilityImpl.getChainName(utilityImpl.getChainId());
        if (currentChainID == 0)
            currentChainID = utilityImpl.getChainId();

        if (keccak256(abi.encodePacked(targetChainName)) == keccak256(abi.encodePacked("")))
            targetChainName = utilityImpl.getChainName(ethChainID);

        if (targetChainID == 0) 
            targetChainID = ethChainID;             
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
       /* console.log("Current Chain ID ${currentChainID}");
        console.log("Current Chain Name ${currentChainName}");
        console.log("Target Chain ID ${targetChainID}");
        console.log("Target Chain Name ${targetChainName}");*/
    }

    // implementation logic for calling external contracts on the target chain
    function callForTargetChain(IUtilityImpl.ContractFunctionCallData calldata contractCallData) public override returns (bytes memory){
                // check the current chain ID

        //require(currentChainId == bridgeInfo.chainIdSourceChain, "This function can only be called from the first chain");

        // construct the function signature
       // bytes memory functionSignature = abi.encodeWithSignature(functionName, functionParams);

        // make the call to the target contract
    //    (bool success, bytes memory result) = targetContract.call(functionSignature);
    
    //    require(success, "Call to target contract failed");

    //    return result;
     return bytes("Done");
    }
    
    // implementation logic for transferring funds to the target chain
    function makeTransferToTargetChain(IUtilityImpl.TransferData calldata transferDetails) public override returns (bool) {
        //To be implemented 
        // get the TokenBridge contract on the Ethereum network
        /*IERC20 token = IERC20(transferDetails.token);
        require(token.approve(HOP_BRIDGE_ETH_ADDRESS, transferDetails.amount), "Failed to approve tokens for transfer");

        // transfer tokens to the TokenBridge contract
        require(HopBridge(HOP_BRIDGE_ETH_ADDRESS).depositTokens(
            address(token),
            transferDetails.amount,
            transferDetails.recipient
        ), "Failed to deposit tokens");*/

        return true;
    }



}
