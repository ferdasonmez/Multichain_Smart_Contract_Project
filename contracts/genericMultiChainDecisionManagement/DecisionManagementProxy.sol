// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";

contract DecisionManagementProxy {

    address public  implementation;
    address public owner = msg.sender;

    function getImplementation() public view returns (address){
        return implementation;
    }
     receive() external payable {
        // This function is intentionally left empty
        // It satisfies the compiler requirement for a receive ether function
    }
    function setImplementation(address _imp) external {
        require(msg.sender == owner);
        implementation = _imp;
    }

    function _delegate(address imp) internal virtual {
        assembly {
            calldatacopy(0, 0, calldatasize())

            let result := delegatecall(gas(), imp, 0, calldatasize(), 0, 0)

            returndatacopy(0, 0, returndatasize())

            switch result
            case 0 {
                revert(0, returndatasize())
            }
            default {
                return(0, returndatasize())
            }
        }
    }

    fallback() external payable {
        _delegate(implementation);
    }

}

