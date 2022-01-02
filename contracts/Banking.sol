pragma solidity >0.5.1;

contract Banking {
    uint256 public serialNumber = 0;

    uint256 public bankBalance = 0;

    uint256 public transaction = 0;

    struct Transaction {
        uint256 transacNum;
        uint256 currentBalance;
        uint256 amountTransacted;
        uint256 createdAt;
        string transacType;
        uint256 accountSerialNumber; 
    }

    mapping(uint256 => Transaction) public transactions;


    struct Account {
        uint256 serial;
        uint256 createdAt;
        string name;
        string location;
        address creator;
        uint256 balance;
        bool doesExist;
    }

    constructor() public {
        accounts[0] = Account(
            0,
            block.timestamp,
            "Ethereal",
            "NIT Durgapur",
            address(this),
            0,
            true
        );
    }

    mapping(uint256 => Account) public accounts;

    function createAccount(
        address payable _creator,
        string memory _name,
        string memory _location
    ) public payable {
        if (_creator.balance >= 3) {
            serialNumber++;

            accounts[serialNumber] = Account(
                serialNumber,
                block.timestamp,
                _name,
                _location,
                _creator,
                2,
                true
            );

            transaction++;

            transactions[transaction] = Transaction(
                transaction,
                2,
                2,
                block.timestamp,
                "Account Creation",
                serialNumber
            );

            bankBalance += 2;
        } else {
            revert("Insufficient Funds");
        }
    }

    function addBalance(
        uint256 _serial,
        uint256 _amount,
        address payable _creator
    ) public payable {
        if (_creator.balance >= _amount / 1000000000000000000 + 1) {
            accounts[_serial].balance += _amount / 1000000000000000000;
            bankBalance += _amount / 1000000000000000000;
            transaction++;
            transactions[transaction] = Transaction(
                transaction,
                bankBalance,
                _amount / 1000000000000000000,
                block.timestamp,
                "Add Balance",
                _serial
            );

        } else {
            revert("Insufficient Funds");
        }
    }

    function withdrawBalance(
        uint256 _serial,
        uint256 _amount,
        address payable _creator
    )

    external returns (bool _success) {
        if(accounts[_serial].balance >= _amount / 1000000000000000000 + 1) {

            _creator.transfer(_amount);
            accounts[_serial].balance -= _amount / 1000000000000000000;
            bankBalance -= _amount / 1000000000000000000;
            transaction++;
            transactions[transaction] = Transaction(
                transaction,
                bankBalance,
                _amount / 1000000000000000000,
                block.timestamp,
                "Withdraw Balance",
                _serial
            );
            return true;
        } else {
            revert("Insufficient Funds");
        }
    }

    function transactAmount (
        uint256 _amount,
        uint256 _serial_2,
        uint256 _serial
    ) public {
        if(accounts[_serial].balance >= _amount / 1000000000000000000 +1 ){
            accounts[_serial].balance -= _amount / 1000000000000000000;
            accounts[_serial_2].balance += _amount / 1000000000000000000;
            transaction++;
            transactions[transaction] = Transaction(
                transaction,
                accounts[_serial].balance,
                _amount / 1000000000000000000,
                block.timestamp,
                "Transfer Balance",
                _serial
            );
        } else {
            revert("Insufficient Funds");
        }
    }

    function getBalance(uint256 _serial) public view returns (uint256) {
        uint256 bal = accounts[_serial].balance;
        return bal;
    }

    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }
}
