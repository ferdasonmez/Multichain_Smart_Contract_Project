
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract EventEmitter {
  event ConstructorEvent();
  event MyEvent();
  event MyEventWithData(uint, string);

  constructor ()  {
    emit ConstructorEvent();
  }

  function emitMyEvent() public {
    emit MyEvent();
  }

  function emitMyEventWithData(uint x, string calldata s) public {
    emit MyEventWithData(x, s);
  }

  function emitBothEvents(uint x, string calldata s) public {
    emit MyEvent();
    emit MyEventWithData(x, s);
  }
}
