pragma solidity ^0.7.0;
// SPDX-License-Identifier: MIT

contract Service {

    // SERVICE AUTHOR, NAME & FEE
    address public author;
    string public name;
    uint public fee;

    // SOURCE CODE REPOSITORY & PARAM INTERFACE
    string public repository;
    string public params;

    // LAST UPDATED
    uint public updated;

    // MODIFICATION EVENT
    event modification();

    // WHEN CREATED, SET SERVICE PARAMS
    constructor(address _author, string memory _name, uint _fee, string memory _repository, string memory _params) {
        author = _author;
        name = _name;
        fee = _fee;
        repository = _repository;
        params = _params;
        updated = block.number;
    }

    // UPDATE SERVICE DETAILS
    function update(string memory _repository, string memory _params) public {

        // UPDATE PARAMS
        repository = _repository;
        params = _params;

        // SET UPDATE BLOCK
        updated = block.number;

        // EMIT MODIFICATION EVENT
        emit modification();
    }
}