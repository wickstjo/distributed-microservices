pragma solidity ^0.7.0;
// SPDX-License-Identifier: MIT

contract TokenManager {

    // MAP OF TOKEN OWNERSHIP, [USER ADDRESS => AMOUNT]
    mapping (address => uint) public tokens;

    // TOKEN DETAILS
    string public symbol;
    uint public price = 0;
    uint public capacity = 0;
    uint public sold = 0;

    // INIT STATUS & TASK MANAGER REFERENCE
    bool public initialized = false;
    address public task_manager;

    // VALUE CHANGE EVENT
    event changes(
        uint capacity,
        uint sold
    );

    // FETCH USER TOKEN BALANCE
    function balance(address user) public view returns(uint) {
        return tokens[user];
    }

    // PURCHASE TOKENS
    function purchase(uint amount) public payable {

        // IF THE CONTRACT HAS BEEN INITIALIZED
        // IF THE SENDER HAS SUFFICIENT FUNDS
        // IF THE CAPACITY HAS NOT BEEN MET
        require(initialized, 'contract has not been initialized');
        require(msg.value == amount * price, 'insufficient funds provided');
        require(amount + sold <= capacity, 'the capacity has been met');

        // FIX FOR OVERFLOW
        uint sum = tokens[msg.sender] + amount;
        require(sum >= tokens[msg.sender], 'token overflow error');

        // INCREASE TOKEN COUNT FOR SENDER
        tokens[msg.sender] += amount;

        // INCREMENT SOLD
        sold += amount;

        // EMIT ASYNC EVENT
        emit changes(capacity, sold);
    }

    // CONSUME USER TOKENS
    function consume(uint amount, address user) public {

        // IF THE CONTRACT HAS BEEN INITIALIZED
        // IF THE CALLER IS THE TASK MANAGER
        require(initialized, 'contract has not been initialized');
        require(msg.sender == task_manager, 'permission denied');

        // FIX FOR OVERFLOW
        uint sum = tokens[user] - amount;
        require(sum <= tokens[user], 'token underflow error');

        // DECREASE TOKEN COUNT FOR USER
        tokens[user] -= amount;

        // MAKE TOKEN AVAILABLE FOR PURCHASE
        sold -= amount;

        // EMIT ASYNC EVENT
        emit changes(capacity, sold);
    }

    // TRANSFER TOKEN TOKENS
    function transfer(uint amount, address from, address to) public {

        // IF THE CONTRACT HAS BEEN INITIALIZED
        // IF THE SENDER HAS ENOUGH TOKENS TO TRANSFER
        require(initialized, 'contract has not been initialized');
        require(msg.sender == task_manager, 'permission denied');

        // FIX FOR OVERFLOW & UNDERFLOW
        uint sum_from = tokens[from] - amount;
        uint sum_to = tokens[to] + amount;

        // FIX FOR OVERFLOW/UNDERFLOW ISSUES
        require(sum_from <= tokens[from], 'token underflow error');
        require(sum_to >= tokens[to], 'token overflow error');

        // REDUCE TOKENS FROM SENDER, THEN INCREASE THEM FOR USER
        tokens[from] -= amount;
        tokens[to] += amount;
    }

    // INITIALIZE THE CONTRACT
    function init(
        string memory _symbol,
        uint _price,
        uint _capacity,
        address _task_manager
    ) public {

        // IF THE CONTRACT HAS NOT BEEN INITIALIZED BEFORE
        require(!initialized, 'contract has already been initialized');

        // SET TOKEN DETAILS
        symbol = _symbol;
        price = _price;
        capacity = _capacity;

        // SET ORACLE MANAGER REFERENCE
        task_manager = _task_manager;

        // BLOCK FURTHER MODIFICATIONS
        initialized = true;
    }
}