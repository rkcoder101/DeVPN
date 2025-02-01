// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract VPNMarketplace {
    struct Provider {
        address addr;
        uint256 bandwidth;
    }

    mapping(address => Provider) public providers;
    IERC20 public bandToken;

    constructor(address _bandToken) {
        bandToken = IERC20(_bandToken);
    }

    function registerProvider(uint256 bandwidth) external {
        providers[msg.sender] = Provider(msg.sender, bandwidth);
    }

    function payProvider(address provider, uint256 amount) external {
        require(bandToken.transferFrom(msg.sender, provider, amount), "Payment failed");
    }
}