// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IProposalActionContract {
    /*struct Action {
        string message;
        address payable receiver;
        uint256 value;
        bytes data;
    }*/

    function addAction(string calldata _message,
        address _sender,
        address _receiver,
        uint256 _amount,
        address _currency,
        uint256 _senderChainId,
        uint256 _receiverChainId) external;

    function executeAction(uint256 index, uint256 proposalId, address _utilityProxyAddress) external;

    function getNumberOfActions() external view returns (uint256);

    function freeze() external;

    function removeAction(uint256 _actionIndex) external;
    
    function setDecisionManager(address _decisionManagerAddress) external;
}

