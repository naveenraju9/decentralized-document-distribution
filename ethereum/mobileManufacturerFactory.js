const Web3 = require('../ethereum/createWeb3');
const web3 = Web3.getWeb3Instance();

const MobileManufacturerFactory = require('./build/MobileManufacturerFactory.json');

module.exports = {
    getInstance : function(){
        return new web3.eth.Contract(JSON.parse(MobileManufacturerFactory.interface), '0x2ee18C45Db9DF0F73866dc51BDEdE346AF714939');
    }
};
