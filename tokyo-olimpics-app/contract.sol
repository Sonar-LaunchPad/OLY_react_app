// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract OlympicToken {
    string private _name = "Olympic Token";
    string private _symbol = "$OLY";
    uint private _decimals = 18;
    uint private _totalSupply = (10**12) * (10**_decimals);
    
    address private _owner;
    uint private _airdropValue = 10 * (10 ** _decimals);

    uint private _NFTProposalVoteMinBalance = 10 * (10 ** _decimals);
    uint private _NFTProposalPrice = 100 * (10 ** _decimals);
    uint private _NFTProposalsLength = 0;

    struct NFTProposal {
        string body;
        bool removed;
        bool fullfilled;
        uint8 flag;
    }
    
    mapping(address => bool) private _airdropClaimers;
    mapping(address => NFTProposal) private _NFTProposals;
    mapping(address => uint) private _NFTProposalsVotersLength;
    mapping(address => mapping(address => bool)) private _NFTProposalsVoters;
    mapping(address => uint) private _balances;
    mapping(address => mapping(address => uint)) private _allowances;

    event Transfer (address indexed from, address indexed to, uint value);
    event Approval (
        address indexed owner,
        address indexed spender,
        uint value
    );
    event OwnershipTransferred (
        address indexed from,
        address indexed to
    );

    modifier onlyOwner() {
        require(_owner == msg.sender, "Caller must be owner");
        _;
    }

    constructor() {
        _owner = msg.sender;
        _balances[msg.sender] = _totalSupply;
        emit Transfer(address(0), msg.sender, _totalSupply);
        emit OwnershipTransferred(address(0), msg.sender);
    }

    function owner() public view returns (address) {
        return _owner;
    }

    function transferOwnership(address newOwner) external onlyOwner {
        _owner=newOwner;
    }

    function airdropValue() public view returns (uint) {
        return _airdropValue;
    }

    function setAirdropValue(uint newValue) external onlyOwner {
        _airdropValue = newValue;
    }

    function claimAirdrop() external {
        require(_airdropValue != 0, "Airdrop not claimed -  airdrop is disabled");
        require(_balances[address(this)] > _airdropValue, "Airdrop not claimed - contract insufficient balance");
        require(_airdropClaimers[msg.sender] != true, "Airdrop not claimed - caller arleady claimed airdrop");
        _balances[address(this)] -= _airdropValue;
        _balances[msg.sender] += _airdropValue;
        _airdropClaimers[msg.sender] = true;
    }

    function createNFTProposal(string memory body) external {
        require(_balances[msg.sender] >= _NFTProposalPrice, "NFTProposal not created - caller insufficient balance");
        require(_NFTProposals[msg.sender].flag != 1, "NFTProposal not created - caller already created NFTProposal");
        _NFTProposals[msg.sender] = NFTProposal(body, false, false, 1);
        _NFTProposalsLength++;
        _balances[msg.sender] -= _NFTProposalPrice;
        _balances[address(this)] += _NFTProposalPrice;
    }

    function getNFTProposal(address proposalAddress) external view returns (string memory, uint, bool) {
        require(_NFTProposals[proposalAddress].flag == 1, "NFTProposal not getted - NFTProposal does not exist");
        string memory body = _NFTProposals[proposalAddress].body;
        uint votersLength = _NFTProposalsVotersLength[proposalAddress];
        bool removed = _NFTProposals[proposalAddress].removed;
        return (body, votersLength, removed);
    }

    function voteForNFTProposal(address NFTProposalAddress) external {
        require(_NFTProposals[NFTProposalAddress].flag == 1, "NFTProposal not voted - NFTProposal does not exist");
        require(_NFTProposals[NFTProposalAddress].removed == false, "NFTProposal not voted - NFTProposal has beed removed");
        require(_NFTProposals[NFTProposalAddress].fullfilled == false, "NFTProposal not voted - NFTProposal has beed fullfilled");
        require(_balances[msg.sender] >= _NFTProposalVoteMinBalance, "NFTProposal not voted - caller insufficient balance");
        require(_NFTProposalsVoters[NFTProposalAddress][msg.sender] != true, "NFTProposal not voted - caller arleady voted for this NFTProposal");
        _NFTProposalsVoters[NFTProposalAddress][msg.sender] = true;
        _NFTProposalsVotersLength[NFTProposalAddress]++;
    }

    function removeNFTProposal(address NFTProposalAddress) external {
        require(_owner == msg.sender || NFTProposalAddress == msg.sender, "Caller must be owner or creator of NFCProposal");
        require(_NFTProposals[NFTProposalAddress].flag == 1, "NFTProposal not removed - NFTProposal does not exist");
        _NFTProposals[NFTProposalAddress].removed = true;
        _NFTProposals[NFTProposalAddress].body = '';
        _NFTProposals[NFTProposalAddress].flag = 0;
        _NFTProposalsVotersLength[NFTProposalAddress] = 0;
        _NFTProposalsLength--;
    }

    function fulfillNFTProposal(address NFTProposalAddress) external onlyOwner {
        require(_NFTProposals[NFTProposalAddress].flag == 1, "NFTProposal not removed - NFTProposal does not exist");
        _NFTProposals[NFTProposalAddress].fullfilled = true;
    }

    function NFTProposalVoteMinBalance() external view returns(uint) {
        return _NFTProposalVoteMinBalance;
    }

    function setNFTProposalVoteMinBalance(uint newValue) external onlyOwner {
        _NFTProposalVoteMinBalance = newValue;
    }

    function NFTProposalPrice() external view returns(uint) {
        return _NFTProposalPrice;
    }

    function setNFTProposalPrice(uint newValue) external onlyOwner {
        _NFTProposalPrice = newValue;
    } 

    function name() public view returns (string memory) {
        return _name;
    }

    function symbol() public view returns (string memory) {
        return _symbol;
    }

    function decimals() public view returns (uint) {
        return _decimals;
    }

    function totalSupply() public view returns (uint) {
        return _totalSupply;
    }

    function balanceOf(address account) external view returns (uint) {
        return _balances[account];
    }

    function transfer(address recipient, uint amount)
    external
    returns (bool)
    {
        _balances[msg.sender] -=amount;
        _balances[recipient] +=amount;
        emit Transfer(msg.sender, recipient, amount);
        return true;
    }

    function approve(address spender, uint amount) external returns (bool) {
        _allowances[msg.sender][spender]=amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }

    function allowance(address owner_, address spender_)
    external
    view
    returns (uint)
    {
        return _allowances[owner_][spender_];
    }

    function transferFrom(
    address sender,
    address recipient,
    uint amount
    ) external returns (bool) {
        _balances[sender] -=amount;
        _balances[recipient] +=amount;
        emit Transfer(sender, recipient, amount);
        _allowances[sender][msg.sender] -=amount;
        emit Approval(sender, msg.sender, _allowances[sender][msg.sender]);
        return true;
    }
}