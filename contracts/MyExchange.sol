pragma solidity 0.5.2;

import "./SafeMath.sol";
import "./IERC20.sol";
import "./Ownable.sol";


contract  MyExchange is Ownable {

    using SafeMath for uint256;

    /// Create functionality for creating orders (buy, sell)
    /// Create functionality to cancel an order

    event LogDepositToken(address _token, address _user, uint256 _amount);
    event LogWithdrawToken(address _token, address _user, uint256 _amount);

    mapping (address => mapping (address => uint256) ) public userBalanceForToken;
    /// mapping (address => mapping (type1 => type2) ) userOrders;

    constructor() public {
    }

    /// Function to send _amount of specific _token to contract
    /// This allows the contract to spend _amount tokens on your behalf.
    /// msg.sender has to call approve on this contract first.
    /// triggers DepositToken event.
    function depositToken(address _token, uint256 _amount) public {
        require(_token != address(0x0));
        require(IERC20(_token).transferFrom(msg.sender, address(this), _amount));
        userBalanceForToken[_token][msg.sender] = userBalanceForToken[_token][msg.sender].add(_amount);
        emit LogDepositToken(_token, msg.sender, _amount);
    }

    /// function to withdraw _amount of specific _token from contract
    /// triggers WithdrawToken event
    function withdrawToken(address _token, uint256 _amount) public {
        require(_token != address(0x0));
        require(userBalanceForToken[_token][msg.sender] >= _amount);
        userBalanceForToken[_token][msg.sender] = userBalanceForToken[_token][msg.sender].sub(_amount);
        require(IERC20(_token).transfer(msg.sender, _amount));
        emit LogWithdrawToken(_token, msg.sender, _amount);
    }

}
