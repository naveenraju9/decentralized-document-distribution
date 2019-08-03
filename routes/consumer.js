const Web3 = require('../ethereum/createWeb3');
const web3 = Web3.getWeb3Instance();
const initializeData = require('./initializeRoute');

const manufacturerToDistributor = require('../ethereum/build/ManufacturerToDistributor.json');
const distributorToRetailer = require('../ethereum/build/DistributorToRetailer.json');
const MobileManufacturerFactory = require('../ethereum/mobileManufacturerFactory');

let manufacturerAddress;

let distributorToRetailerContractAddress;
let distributorToRetailerObj;
let mobileManufacturerFactoryInstance;

let manufacturerToDistributorContractAddress;
let manufacturerToDistributorObj;

module.exports = {

    initializeContract : async(req, res) => {
        manufacturerAddress = await initializeData.getManufacturerAddress();
        mobileManufacturerFactoryInstance = MobileManufacturerFactory.getInstance();

        [manufacturerToDistributorContractAddress] = await mobileManufacturerFactoryInstance.methods.getDeployedManufacturerToDistributor().call();
        manufacturerToDistributorObj = new web3.eth.Contract(JSON.parse(manufacturerToDistributor.interface), manufacturerToDistributorContractAddress);    
    
       
        [distributorToRetailerContractAddress] = await mobileManufacturerFactoryInstance.methods.getDeployedDistributorToRetailer().call();
        distributorToRetailerObj = new web3.eth.Contract(JSON.parse(distributorToRetailer.interface), distributorToRetailerContractAddress);
        res.send("initialized successfully");    
    },

    getProductsInformation : async(req, res) => {
        var productName = req.query.productName;
        let manufacturerShippingLocation = [];
        let distributorAddresses = [];
        let listOfProductsByName = [];

        let distributorShippingLocation = [];
        let retailorShippingLocation = [];
        let retailorsAddress = [];
        try {
            var manufacturerToDistributorResult = await manufacturerToDistributorObj.methods.getProductByProductName(productName).call();
            var distributorToRetailorResult = await distributorToRetailerObj.methods.getProductByProductName(productName).call();

            manufacturerShippingLocation = manufacturerToDistributorResult[0];
            distributorAddresses = manufacturerToDistributorResult[1];

            distributorShippingLocation = distributorToRetailorResult[0];
            retailorShippingLocation = distributorToRetailorResult[1];
            retailorsAddress = distributorToRetailorResult[2];

            for (var i = 0; i < distributorShippingLocation.length ; i++) {
                var addressInfo = {
                    "manufacturerShippingLocation" : web3.utils.toAscii(manufacturerShippingLocation[i]),
                    "productName" : productName,
                    "distributorAddress": distributorAddresses[i]
                };
                listOfProductsByName.push(addressInfo);
            }

            for (var i = 0; i < distributorShippingLocation.length; i++) {
                var addressInfo = {
                    "distributorShippingLocation" : web3.utils.toAscii(distributorShippingLocation[i]),
                    "productName" : productName,
                    "retailorAddress": distributorAddresses[i],
                    "retailorShippingLocation": web3.utils.toAscii(retailorShippingLocation[i])
                };
                listOfProductsByName.push(addressInfo);
            }
    
            res.send(listOfProductsByName);
        } catch(err) {
            throw err;
        }
    }
}