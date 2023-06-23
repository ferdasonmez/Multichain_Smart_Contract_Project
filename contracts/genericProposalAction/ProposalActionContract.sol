// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "../genericMultiChainDecisionManagement/IDecisionManagementImpl.sol";
import "../genericMultiChainDecisionManagement/DecisionManagementImpl.sol";
import "../genericMultiChainDecisionManagement/DecisionManagementProxy.sol";
import "../bridge/GenericBridgeImpl.sol";
import { UtilityImpl as MyUtilityImpl } from "./../utility/UtilityImpl.sol";

contract ProposalActionContract is Ownable {
     enum ActionType {
        TransferMoney,
        CallSmartContractFunction
    }

    struct ActionAddress {
    address to;
    address from;
    uint256 senderChainId;
    uint256 receiverChainId;
    }

    struct ActionContractDetails {
        string contractName;
        string functionName;
    }
    struct MoneyTransferDetails {
        uint256 value;
        string currencyType;
    }
    struct ProposalAction {
        uint256 actionType;
        bytes message;
        ActionContractDetails contractDetails;
        ActionAddress addressInfo;
        MoneyTransferDetails moneyTransferDetails;

    }


    ProposalAction[] public actions;
    bool public frozen;

    function addAction(
        uint256 _actionType,
        bytes calldata _message,
        string calldata  _contractName,
        string calldata _functionName,
        address _sender,
        address _receiver,
        uint256 _amount,
        string calldata _currency,
        uint256 _senderChainId,
        uint256 _receiverChainId
    ) public onlyOwner {
        require(!frozen, "Contract is frozen");

        ActionAddress memory addressInfo;
        MoneyTransferDetails memory moneyTransferDetails;
        ActionContractDetails memory contractDetails;
        ProposalAction memory action;
        string memory contractName = _contractName;
        
        {
            addressInfo = ActionAddress({
                from: _sender,
                to: _receiver,
                senderChainId: _senderChainId,
                receiverChainId: _receiverChainId
            });
            
            moneyTransferDetails = MoneyTransferDetails({
                currencyType: _currency,
                value: _amount
            });
        }
        {   
            contractDetails = ActionContractDetails({
                contractName: contractName,
                functionName: _functionName
            });
        }
        {    
            action = ProposalAction({
                actionType: _actionType,
                message: _message,
                addressInfo: addressInfo,
                contractDetails: contractDetails,
                moneyTransferDetails: moneyTransferDetails
            });
        }
        
        actions.push(action);
    }


    modifier onlyFromDecisionManager() {
        require(msg.sender == address(decisionManager), "Can only be called by the DecisionManager contract");
        _;
    }

    IDecisionManagementImpl public decisionManager;
    MyUtilityImpl utilityImpl;
    constructor() {}

    function setDecisionManager(address _decisionManagerAddress) public onlyOwner {
        require(address(decisionManager) == address(0), "DecisionManager can only be set once");
        decisionManager = DecisionManagementImpl(_decisionManagerAddress);
    }    
  
    function executeAction(uint256 index, uint256 proposalId, address _utilityProxyAddress) public onlyFromDecisionManager {
        require(index < actions.length, "Invalid index");
        ProposalAction storage action = actions[index];
   

        require(_utilityProxyAddress != address(0), "Utility proxy address is null");
        UtilityProxy utilityProxy = UtilityProxy(
            payable(address(_utilityProxyAddress))
        );
        utilityImpl = MyUtilityImpl(
            address(utilityProxy.implementation.address)
        );
        require(address(utilityImpl) != address(0), "Utility implementation not found");

        require(action.addressInfo.senderChainId == utilityImpl.getChainId(), "This action can not be started from current chain" );

        if (action.addressInfo.receiverChainId != utilityImpl.getChainId()){
            address bridgeImplAddress = utilityImpl.getBridgeImplementation(action.addressInfo.senderChainId, action.addressInfo.receiverChainId);
            require(bridgeImplAddress != address(0), "Bridge implementation not found");
            GenericBridgeImpl bridge = GenericBridgeImpl(bridgeImplAddress);
            if(action.actionType == uint256(ActionType.TransferMoney)){
                IUtilityImpl.TransferData memory transferDetails = IUtilityImpl.TransferData({
                sender: action.addressInfo.from,
                receiver: action.addressInfo.to,
                amount: action.moneyTransferDetails.value,
                currencyType: action.moneyTransferDetails.currencyType,
                memo: action.message});
                bridge.makeTransferToTargetChain(transferDetails);
            }
            else if(action.actionType == uint256(ActionType.CallSmartContractFunction)){
                IUtilityImpl.ContractFunctionCallData memory contractFunctionCallData = IUtilityImpl.ContractFunctionCallData({
                targetContractAddress: action.addressInfo.to,
                targetcontractName: action.contractDetails.contractName,
                targetfunctionName: action.contractDetails.functionName,
                parameters: action.message
                });

                bridge.callForTargetChain(contractFunctionCallData);
            }

    

        }else{
            //same chain


        }

        emit ActionExecuted(
            proposalId,
            index,
            action.message,
            action.addressInfo.from,
            action.addressInfo.to,
            action.moneyTransferDetails.value,
            action.moneyTransferDetails.currencyType
        );

        delete actions[index];
    }

    function getNumActions() public view returns (uint256) {
        return actions.length;
    }

    function freeze() public onlyOwner {
        frozen = true;
    }

    function removeAction(uint256 index) public onlyOwner {
        require(index < actions.length, "Invalid index");
        require(!frozen, "Contract is frozen");
        delete actions[index];
    }

    event ActionExecuted(
        uint256 proposalId,
        uint256 index,
        bytes message,
        address sender,
        address receiver,
        uint256 amount,
        string currency
    );
}
