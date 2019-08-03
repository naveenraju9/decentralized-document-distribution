//const ganache = require('ganache-cli');

const Web3 = require('../ethereum/createWeb3');
const web3 = Web3.getWeb3Instance();

let accounts;
let distributorAddresses = [];
let retailerAddresses = [];
let manufacturerAddress;

module.exports = {
    initializeData : async(req, res) =>  {
        accounts = await web3.eth.getAccounts(); 
        manufacturerAddress = accounts[0];
        distributorAddresses = accounts.slice(1, 5);
        retailerAddresses = accounts.slice(5, 10);
    },
    getDistributorAddress : async(req, res) => {
        res.send(distributorAddresses);
    },
    getRetailerAddresses : async(req, res) => {
        res.send(retailerAddresses);
    },
    getManufacturerAddress : async(req, res) => {
        return manufacturerAddress;
    }
}
