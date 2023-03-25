// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

// Eth is time beacon chain
contract Tab {
    // slot, miner's address, block hash
    mapping(uint => mapping(address => bytes32)) public tabs;

    // save time beacon
    function setTab(uint slot, address creator, bytes32 blockHash) public {
        require(slot > 0, "Invalid slot number");
        require(creator != address(0), "Invalid creator address");
        require(blockHash != bytes32(0), "Invalid block hash");
        tabs[slot][creator] = blockHash;
    }

    // multiple save time beacon
    function setTabs(
        uint slot,
        address[] memory creators,
        bytes32[] memory blockhashs
    ) public {
        require(
            creators.length > 0 && blockhashs.length > 0,
            "Invalid input arrays"
        );
        require(creators.length == blockhashs.length, "Arrays length mismatch");
        uint length = creators.length;
        for (uint i = 0; i < length; i++) {
            require(creators[i] != address(0), "Invalid creator address");
            require(blockhashs[i] != bytes32(0), "Invalid block hash");
            setTab(slot, creators[i], blockhashs[i]);
        }
    }

    // check time beacon
    function hasBlock(
        uint slot,
        address creator,
        bytes32 blockHash
    ) public view returns (bool) {
        bytes32 currentBlockHash = tabs[slot][creator];
        if (currentBlockHash == bytes32(0)) {
            // if current block's hash is 0, then there is no corresponding key-value pair in the mapping
            return false;
        }
        return currentBlockHash == blockHash;
    }
}
