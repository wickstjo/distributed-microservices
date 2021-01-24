pragma solidity ^0.7.0;
pragma experimental ABIEncoderV2;
// SPDX-License-Identifier: MIT

contract Oracle {

    // ADDRESS REFERENCES
    address public owner;
    address public task_manager;
    address public oracle_manager;

    // SERVICES & TASK BACKLOG
    Reference[] public services;
    address[] public backlog;

    // SERVICE REFERENCE
    struct Reference {
        address service;
        uint fee;
    }

    // DEVICE STATUS
    bool public active;
    bool public discoverable;

    // DISCOVERY CONFIGURATION
    string public config;

    // NUMBER OF COMPLETED ASSIGNMENTS
    uint public completed;

    // EVENTS
    event middleware();
    event modification();

    // WHEN CREATED, SET ADDRESS REFERENCES
    constructor(address _owner, address _task_manager, address _oracle_manager) {
        owner = _owner;
        task_manager = _task_manager;
        oracle_manager = _oracle_manager;
    }

    // FETCH TASK BACKLOG
    function fetch_services() public view returns(Reference[] memory) {
        return services;
    }

    // FETCH TASK BACKLOG
    function fetch_backlog() public view returns(address[] memory) {
        return backlog;
    }

    // UPDATE DEVICE MIDDLEWARE
    function update_middleware() public {

        // IF THE SENDER IS THE DEVICE ORACLES OWNER
        require(msg.sender == owner, 'permission denied');

        // EMIT EVENT TO DEVICE
        emit middleware();
    }

    // UPDATE DEVICE DISCOVERY CONFIG
    function update_config(string memory data) public {

        // IF THE SENDER IS THE DEVICE ORACLES OWNER
        require(msg.sender == owner, 'permission denied');

        // SAVE THE NEW CONFIG IN THE CONTRACT
        config = data;

        // EMIT CONTRACT MODIFIED EVENT
        emit modification();
    }

    // TOGGLE ACTIVE STATUS
    function toggle_active() public {

        // IF THE SENDER IS THE ORACLES OWNER
        require(msg.sender == owner, 'permission denied');

        // TOGGLE STATUS
        active = !active;

        // EMIT CONTRACT MODIFIED EVENT
        emit modification();
    }

    // TOGGLE DISCOVERABLE STATUS
    function toggle_discoverable() public {

        // IF THE SENDER IS THE ORACLES OWNER
        require(msg.sender == owner, 'permission denied');

        // TOGGLE STATUS
        discoverable = !discoverable;

        // EMIT CONTRACT MODIFIED EVENT
        emit modification();
    }

    // ASSIGN TASK TO DEVICE
    function assign_task(address task) public {

        // IF THE SENDER IS THE TASK MANAGER
        require(msg.sender == task_manager, 'permission denied');

        // ADD TASK TO BACKLOG
        backlog.push(task);

        // EMIT CONTRACT MODIFIED EVENT
        emit modification();
    }

    // CLEAR FINISHED TASK FROM BACKLOG
    function clear_task(address target, uint reward) public {

        // IF THE SENDER IS THE TASK MANAGER
        require(msg.sender == task_manager, 'permission denied');

        // LOOP & FIND
        for(uint index = 0; index < backlog.length; index++) {
            if (address(backlog[index]) == target) {

                // DELETE THE ASSIGNMENT & INCREMENT COMPLETED
                delete backlog[index];
                completed += reward;

                // EMIT CONTRACT MODIFIED EVENT
                emit modification();
            }
        }
    }

    // CHECK IF ORACLE HAS A SPECIFIC SERVICE
    function find_service(address service) public view returns(int) {

        // LOOP THROUGH SERVICES
        for (uint index = 0; index < services.length; index++) {
            if (services[index].service == service) {

                // EXISTS
                return int(index);
            }
        }

        // DOES NOT EXIST
        return -1;
    }

    // ADD SERVICE TO ORACLE
    function add_service(address service, uint fee) public {

        // IF SENDER IS THE ORACLE MANAGER
        require(msg.sender == oracle_manager, 'permission denied');

        // ADD TO AVAILABLE SERVICES
        services.push(
            Reference({
                service: service,
                fee: fee
            })
        );
    }

    // REMOVE SERVICE FROM ORACLE
    function remove_oracle(address service) public {

        // IF SENDER IS THE ORACLE MANAGER
        require(msg.sender == owner, 'permission denied');

        // FIND THE SERVICE INDEX
        int index = find_service(service);

        // IF THE SERVICE EXISTS, REMOVE IT
        if (index != -1) {
            delete services[uint(index)];
        }
    }
}