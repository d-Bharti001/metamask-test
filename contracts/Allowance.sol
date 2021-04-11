// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.1;

/**
 * @title Allowance and Ownership details
 * @author Dharmveer Bharti
 * @notice Stores the owner's account and the allowances for different users
 * @dev All function calls are currently implemented without side effects.
 *      Overflow checks are not required as they are internally implemented
 *      by the compiler starting from v0.8.0
 */
contract Allowance {

    /**
     * @notice Owner's address who deployed the contract
     */
    address public owner;

    /**
     * @notice Allowances for different user addresses
     */
    mapping(address => uint) public allowance;

    /**
     * @notice Event which specifies that the allowance for a user has been updated
     * @param _user User's address whose allowance is changed
     * @param _changedBy Address of the caller of the function
     * @param _oldAllowance Old allowance of the user
     * @param _newAllowance New allowance of the user
     */
    event AllowanceChanged(
        address indexed _user,
        address indexed _changedBy,
        uint _oldAllowance,
        uint _newAllowance
    );

    /**
     * @notice Store the owner's address at the time of deployment
     */
    constructor() {
        owner = msg.sender;
    }

    /**
     * @notice Require that only the owner can execute the function
     */
    modifier onlyOwner() {
        require(msg.sender == owner, "You are not the owner.");
        _;
    }

    /**
     * @notice Set allowance for a new/existing user
     * @param _user User's address
     * @param _amount New amount as the allowance
     */
    function setAllowance(address _user, uint _amount) public onlyOwner {

        emit AllowanceChanged(_user, msg.sender, allowance[_user], _amount);

        allowance[_user] = _amount;
    }

    /**
     * @notice Reduce allowance for a user when they withdraw money from the wallet
     * @param _user User's address
     * @param _amountDeducted Amount withdrawn by the user
     */
    function reduceAllowance(address _user, uint _amountDeducted) internal {

        emit AllowanceChanged(
            _user,
            msg.sender,
            allowance[_user],
            allowance[_user] - _amountDeducted
        );

        allowance[_user] -= _amountDeducted;
    }
}
