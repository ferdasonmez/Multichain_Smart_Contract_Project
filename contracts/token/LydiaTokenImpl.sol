// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract LydiaTokenImpl {
    string public name;
    string public symbol;
    uint8 public decimals;
    uint256 public totalSupply;
    mapping(address => uint256) public balances;

    event Transfer(address indexed from, address indexed to, uint256 value);

    constructor() {
        name = "LydiaToken";
        symbol = "LYDIA";
        decimals = 18;
        totalSupply = 1000000 * (10**uint256(decimals)); // Total supply: 1,000,000 LYDA tokens
        balances[msg.sender] = totalSupply;
    }

    function transfer(address to, uint256 value) public returns (bool) {
        require(balances[msg.sender] >= value, "Insufficient balance");
        balances[msg.sender] -= value;
        balances[to] += value;
        emit Transfer(msg.sender, to, value);
        return true;
    }

    function balanceOf(address account) public view returns (uint256) {
        return balances[account];
    }
}