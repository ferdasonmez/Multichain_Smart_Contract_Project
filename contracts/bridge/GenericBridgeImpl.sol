// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./IGenericBridgeImpl.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "../utility/IUtilityImpl.sol";
import { UtilityImpl as MyUtilityImpl } from "./../utility/UtilityImpl.sol";
import "../utility/UtilityProxy.sol";
import "@openzeppelin/contracts/utils/Address.sol";


abstract contract GenericBridgeImpl is IGenericBridgeImpl, Ownable {
    struct BridgeInfo {
        string nameSourceChain;
        string nameTargetChain;
        uint256 chainIdSourceChain;
        uint256 chainIdTargetChain;
    }

    BridgeInfo public bridgeInfo;
    IUtilityImpl public utilityImpl;

    constructor(
        address _utilityProxyAddress,
        string memory _nameSourceChain,
        string memory _nameTargetChain,
        uint256 _chainIdSourceChain,
        uint256 _chainIdTargetChain
    ) {
        UtilityProxy utilityProxy = UtilityProxy(
            payable(address(_utilityProxyAddress))
        );
        utilityImpl = MyUtilityImpl(
            address(utilityProxy.implementation.address)
        );

        require(
            _chainIdSourceChain == utilityImpl.getChainId(),
            "Bridge source Chain ID does not suit current chain"
        );
        bridgeInfo = BridgeInfo(
            _nameSourceChain,
            _nameTargetChain,
            _chainIdSourceChain,
            _chainIdTargetChain
        );
        utilityImpl.setBridgeImplementation(
            _chainIdSourceChain,
            _chainIdTargetChain,
            address(this)
        );
    }

    // implementation logic for calling external contracts on the target chain
    function callForTargetChain(
        IUtilityImpl.ContractFunctionCallData calldata contractCallData
    ) public virtual returns (bytes memory);

    // implementation logic for transferring funds to the target chain
    function makeTransferToTargetChain(
        IUtilityImpl.TransferData calldata transferDetails
    ) public virtual returns (bool);

    /*modifier onlyOwner() override {
        require(msg.sender == owner(), "Only contract owner can perform this action");
        _;
    }*/

}