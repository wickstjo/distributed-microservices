pragma solidity ^0.7.0;
pragma experimental ABIEncoderV2;
// SPDX-License-Identifier: MIT

import { Oracle } from './oracle.sol';
import { UserManager } from './user_manager.sol';
import { ServiceManager } from './service_manager.sol';

contract OracleManager {

    // MAP OF ALL ORACLES, [ORACLE ID => CONTRACT]
    mapping (string => Oracle) public oracles;

    // USER DEVICE COLLECTIONS, [USER ADDRESS => LIST OF ORACLE IDs]
    mapping (address => string[]) public collections;

    // REFERENCES
    UserManager public user_manager;
    ServiceManager public service_manager;
    address public task_manager;

    // INIT STATUS
    bool public initialized = false;

    // ORACLE ADDED EVENT
    event added();

    // FETCH ORACLE BY ID
    function fetch_oracle(string memory id) public view returns(Oracle) {
        return oracles[id];
    }

    // FETCH USER COLLECTION
    function fetch_collection(address user) public view returns(string[] memory) {
        return collections[user];
    }

    // CREATE NEW ORACLE
    function create(string memory id) public {

        // IF THE CONTRACT HAS BEEN INITIALIZED
        // IF THE USER IS REGISTERED
        // IF THE ORACLE DOES NOT EXIST
        require(initialized, 'contract has not been initialized');
        require(user_manager.exists(msg.sender), 'you need to be a registered user');
        require(!exists(id), 'identifier already exists');

        // INSTATIATE & INDEX NEW ORACLE
        oracles[id] = new Oracle(
            msg.sender,
            task_manager,
            address(this)
        );

        // PUSH INTO SENDERS COLLECTION
        collections[msg.sender].push(id);

        // EMIT EVENT
        emit added();
    }

    // ADD A SERVICE TO AN ORACLE
    function add_service(
        address _service,
        string memory _oracle,
        uint _fee
    ) public {

        // IF THE ORACLE EXISTS
        // IF THE SERVICE EXISTS
        require(exists(_oracle), 'oracle does not exist');
        require(service_manager.exists(_service), 'service does not exist');

        // SHORTCUT TO ORACLE
        Oracle oracle = fetch_oracle(_oracle);

        // IF THE SENDER IS THE ORACLE OWNER
        // IF THE ORACLE DOES NOT ALREADY OFFER THE SERVICE
        require(oracle.owner() == msg.sender, 'you are not the oracles owner');
        require(oracle.find_service(_service) == -1, 'oracle already offers this service');

        // ADD THE SERVICE
        oracle.add_service(_service, _fee);
    }

    // INITIALIZE THE CONTRACT
    function init(
        address _user_manager,
        address _service_manager,
        address _task_manager
    ) public {

        // IF THE CONTRACT HAS NOT BEEN INITIALIZED BEFORE
        require(!initialized, 'contract has already been initialized');

        // SET REFERENCES
        user_manager = UserManager(_user_manager);
        service_manager = ServiceManager(_service_manager);
        task_manager = _task_manager;

        // BLOCK RE-INITIALIZATION
        initialized = true;
    }

    // CHECK IF ORACLE EXISTS
    function exists(string memory id) public view returns(bool) {
        if (address(oracles[id]) != 0x0000000000000000000000000000000000000000) {
            return true;
        } else {
            return false;
        }
    }
}