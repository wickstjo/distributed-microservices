pragma solidity ^0.7.0;
// SPDX-License-Identifier: MIT

contract Task {

    // RELATED PARTIES
    address public creator;
    address public task_manager;
    string public oracle;

    // TASK DETAILS
    address public service;
    uint256 public expires;

    // TOKEN FEES
    uint public reward;
    uint public stake;
    uint public fee;

    // EXECUTION PARAMS
    string public params;

    // SELF DESTRUCTION EVENT
    event destroyed();

    // WHEN CREATED..
    constructor(
        address _creator,
        string memory _oracle,
        address _service,
        uint _timelimit,
        uint _reward,
        uint _stake,
        uint _fee,
        string memory _params
    ) {

        // SET REFERENCES
        creator = _creator;
        task_manager = msg.sender;
        oracle = _oracle;
        service = _service;

        // SET TASK DETAILS
        expires = block.number + _timelimit;
        params = _params;

        // SET TOKEN RELATED PARAMS
        reward = _reward;
        stake = _stake;
        fee = _fee;
    }

    // SELF DESTRUCT
    function destroy() public {

        // IF THE SENDER IS THE TASK MANAGER
        require(msg.sender == task_manager, 'permission denied');
        
        // EMIT DESTRUCTION EVENT & SELF DESTRUCT
        emit destroyed();
        selfdestruct(address(uint160(address(this))));
    }
}