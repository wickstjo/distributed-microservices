pragma solidity ^0.7.0;
// SPDX-License-Identifier: MIT

// IMPORT INTERFACE
import { Service } from './service.sol';

contract ServiceManager {

    // MAP OF ALL SERVICES, [ADDRESS => INTERFACE]
    mapping (address => Service) public services;

    // SERVICE ADDED EVENT
    event added();

    // CREATE NEW SERVICE
    function create(string memory name, uint fee, string memory repository, string memory params) public {

        // INSTANTIATE NEW SERVICE
        Service service = new Service(
            msg.sender,
            name,
            fee,
            repository,
            params
        );

        // INDEX THE SERVICE
        services[address(service)] = service;

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
}