// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.1;

import "./Allowance.sol";

/**
 * @title Shared Wallet
 * @author Dharmveer Bharti
 * @notice Users can interact with the wallet with this contract
 * @dev All function calls are currently implemented without side effects.
 *      Overflow checks are not required as they are internally implemented
 *      in the compiler starting from v0.8.0
 */
contract SharedWallet is Allowance {

    /**
     * @notice Event specifying money is received into the wallet
     * @param _from Address which deposits money
     * @param _amount Money which is deposited
     */
    event MoneyReceived(address indexed _from, uint _amount);

    /**
     * @notice Event specifying money is withdrawn from the wallet
     * @param _by User who withdraws the money
     * @param _beneficiary Account to which money is transferred
     * @param _amount Money which is withdrawn
     */
    event MoneyWithdrawn(address indexed _by, address _beneficiary, uint _amount);

    /**
     * @notice Allow the owner to deposit money into the wallet
     */
    receive() external payable onlyOwner {
        emit MoneyReceived(msg.sender, msg.value);
    }

    /**
     * @notice Allow any user or the owner to withdraw money from the wallet.
     *         The caller of the function is the one who is going to withdraw money.
     *         Owner can withdraw any amount of money.
     *         Any other user can withdraw any amount limited by the allowance set for them.
     * @param _to Account where the money is transferred
     * @param _amount Money which is withdrawn
     */
    function withdrawMoney(address payable _to, uint _amount) public {

        require(_amount <= address(this).balance, "There is not enough money in wallet.");

        if(msg.sender != owner) {
            require(_amount <= allowance[msg.sender], "You are not allowed to withdraw this much money.");
            reduceAllowance(msg.sender, _amount);
        }
        _to.transfer(_amount);

        emit MoneyWithdrawn(msg.sender, _to, _amount);
    }
}
