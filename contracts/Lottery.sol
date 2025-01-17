// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract Lottery {
    address public manager;
    address payable[] public players;

    constructor() {
        manager = msg.sender;
    }

    function enter() public payable {
        // input bool expression inside require
        // if bool is false, function execution stops
        require(msg.value > .01 ether); // 0.01 ether converts to wei
        players.push(payable(msg.sender));
    }

    function random() public view returns (uint) {
        // Below how it was shown in the course, which was causing warnings/errors
        // return unit(keccak256(block.difficulty, now, players));
        return
            uint(
                keccak256(
                    abi.encodePacked(block.prevrandao, block.timestamp, players)
                )
            );
    }

    function pickWinner() public payable restricted {
        uint index = random() % players.length;
        players[index].transfer(address(this).balance);
        // create new dynamic array of payable addresses with initial size of 0
        players = new address payable[](0);
    }

    modifier restricted() {
        require(msg.sender == manager);
        _;
    }

    function getPlayers() public view returns (address payable[] memory) {
        return players;
    }
}
