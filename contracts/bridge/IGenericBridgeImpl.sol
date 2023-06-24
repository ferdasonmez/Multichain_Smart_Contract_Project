// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "../utility/IUtilityImpl.sol";
interface IGenericBridgeImpl {
    
      // implementation logic for transferring funds to the target chain
    function makeTransferToTargetChain(IUtilityImpl.TransferData calldata transferDetails) external returns (bool) ;

    // implementation logic for calling external contracts on the target chain
    function callForTargetChain(IUtilityImpl.ContractFunctionCallData calldata functionCallInfo) external returns (bytes memory);
    
  
}