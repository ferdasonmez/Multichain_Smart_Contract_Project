// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title EternalStorageV1
 * @dev This contract holds all the necessary state variables to carry out the storage of any contract.
 */
contract EternalStorageV1 {

  mapping(bytes32 => uint256) internal uintStorage;
  mapping(bytes32 => string) internal stringStorage;
  mapping(bytes32 => address) internal addressStorage;
  mapping(bytes32 => bytes) internal bytesStorage;
  mapping(bytes32 => bool) internal boolStorage;
  mapping(bytes32 => int256) internal intStorage;

}