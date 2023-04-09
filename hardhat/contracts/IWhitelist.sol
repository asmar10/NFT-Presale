// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

interface IWhitelist {
    function whitelistedAddresses(address) external view returns (bool);
}
