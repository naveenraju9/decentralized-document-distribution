pragma solidity ^0.4.24;

contract DocumentStore {
    string ipfsHash;
    string documentid;

    function set(string hash, string documentId) public {
        ipfsHash = hash;
        documentid = documentId;
    }

    function get() public view returns (string) {
        return ipfsHash;
    }
}

contract User{

    enum Role {STUDENT, RECOMENDER}
    
    mapping(string => address) private _userAccount;
    mapping(address => Role) private _userRole;
    mapping(address => string) private _userName;
    mapping(string => string) private purposeList;


    struct UserInfo {
        address userAccount;
        string name;
        string email;
        uint32 role;
        string documentsHash;
    }

    mapping(address => UserInfo) private users;

    function registerUserDetails(string userName, string email, address account, uint32 role, string docHash) public returns(bool response){

        _userAccount[userName] = account;
        
        _userRole[account]= Role(role);
        _userName[account] = userName;
        
        UserInfo memory uInfo = UserInfo({
            userAccount: account,
            name: userName,
            email: email,
            role: role,
            documentsHash: docHash
        });
        
        
        users[account] = uInfo;
        return true;
    }

    function getUserDetails(address userAccount) public view returns(string name, string email, string documentHash, uint32 role, address userAddress){
        return (users[userAccount].name, users[userAccount].email, users[userAccount].documentsHash, users[userAccount].role,  users[userAccount].userAccount);
    }

    function updateDocumentHash(address userAccount, string documentHash) public returns(bool status) {
        users[userAccount].documentsHash = documentHash;
        return true;
    }

    function getDocumentHashByUserId(address userAccount) public view returns(string documentHash){
        return (users[userAccount].documentsHash);
    }
    
    function getRole(address account) public view returns (uint32) {
        return uint32(_userRole[account]);
    }
    
    function getUserAccount(string username) public view returns (address) {
        return _userAccount[username];
    }
    
    function createPurpose(string userID, string purpose) public returns(bool status) {
        purposeList[purpose] = userID;
        return true;
    }

    function getUserIdBasedOnPurpose(string purpose) public view returns(string userId) {
        return purposeList[purpose];
    }


    
    
}