const Web3 = require('../ethereum/createWeb3');
const web3 = Web3.getWeb3Instance();

const ManufacturerToDistributor = require('./build/ManufacturerToDistributor.json');

module.exports = {
    getInstance : function(address){
        return new web3.eth.Contract(JSON.parse(ManufacturerToDistributor.interface), address);
    }
};
