
const Web3 = require('./createWeb3');
const web3 = Web3.getWeb3Instance();

const documentStore = require('../ethereum/build/DocumentStore.json')
const userContract = require('../ethereum/build/User.json');

let contractOwnerAddress = null;
let userContractOwnerAddress = null;
let accounts = [];

module.exports = {
    deployContract : async() => {
         accounts = await web3.eth.getAccounts();
         contractOwnerAddress = accounts[0];
        
         const documentStoreResult = await new web3.eth.Contract(JSON.parse(documentStore.interface))
         .deploy({data : documentStore.bytecode})
         .send({gas : '3000000', from : contractOwnerAddress}); // need to implement get the gas dynamically
         return documentStoreResult;
    },

    getContrcatOwnerAddress : function() {
        return contractOwnerAddress;
    },

    deployUserContract: async() => {
         accounts = await web3.eth.getAccounts();
         userContractOwnerAddress = accounts[0];
        
         const userContractResult = await new web3.eth.Contract(JSON.parse(userContract.interface))
         .deploy({data : userContract.bytecode})
         .send({gas : '3000000', from : userContractOwnerAddress}); // need to implement get the gas dynamically
         return userContractResult; 
    },

    getUserContractOwnerAddress: async() => {
        return userContractOwnerAddress;
    }
}