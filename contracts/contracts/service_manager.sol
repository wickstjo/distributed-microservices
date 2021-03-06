pragma solidity ^0.7.0;
// SPDX-License-Identifier: MIT

// IMPORT INTERFACE
import { Service } from './service.sol';
import { UserManager } from './user_manager.sol';

contract ServiceManager {

    // MAP OF ALL SERVICES, [ADDRESS => INTERFACE]
    mapping (address => Service) public services;

    // ITERABLE LIST OF SERVICES
    address[] public listed;

    // INIT STATUS & MANAGER REFERENCES
    bool public initialized = false;
    UserManager public user_manager;

    // SERVICE ADDED EVENT
    event added();

    // FETCH LIST OF SERVICES
    function fetch_services() public view returns(address[] memory) {
        return listed;
    }

    // FETCH SPECIFIC SERVICE
    function fetch_service(address service) public view returns(Service) {
        return services[service];
    }

    // CREATE NEW SERVICE
    function create(
        string memory name,
        uint fee,
        string memory repository,
        string memory params
    ) public {

        // IF CONTRACT HAS BEEN INITIALIZED
        // IF THE USER IS REGISTERED
        require(initialized, 'contracts have not been initialized');
        require(user_manager.exists(msg.sender), 'you need to be registered');

        // INSTANTIATE NEW SERVICE
        Service service = new Service(
            msg.sender,
            name,
            fee,
            repository,
            params
        );

        // INDEX & LIST THE SERVICE
        services[address(service)] = service;
        listed.push(address(service));

        // EMIT ADDED EVENT
        emit added();
    }

    // CHECK IF SERVICE EXISTS
    function exists(address service) public view returns(bool) {
        if (address(services[service]) != 0x0000000000000000000000000000000000000000) {
            return true;
        } else {
            return false;
        }
    }

    // INITIALIZE THE CONTRACT
    function init(address _user_manager) public {

        // IF THE CONTRACT HAS NOT BEEN INITIALIZED
        require(!initialized, 'contract has already been initialized');

        // SET USER MANAGER REFERENCE
        user_manager = UserManager(_user_manager);

        // BLOCK FURTHER MODIFICATION
        initialized = true;
    }
}