const Web3 = require('../ethereum/createWeb3');
const web3 = Web3.getWeb3Instance();
const initializeData = require('./initializeRoute');

const distributorToRetailer = require('../ethereum/build/DistributorToRetailer.json');
//const distributorToRetailer = require('../ethereum/build/DistributorToretailer.json');
//const ManufacturerToDistributor =  require('../ethereum/manufacturerToDistributor');

const MobileManufacturerFactory = require('../ethereum/mobileManufacturerFactory');

//const mobileManufacturerFactory = require('../ethereum/build/MobileManufacturerFactory.json')

let manufacturerAddress;
let distributorToRetailerContractAddress;
let distributorToRetailerObj;
let mobileManufacturerFactoryInstance;

module.exports = {

    initializeContract : async(req, res) => {
        manufacturerAddress = await initializeData.getManufacturerAddress();
        mobileManufacturerFactoryInstance = MobileManufacturerFactory.getInstance();
    
        await mobileManufacturerFactoryInstance.methods.createModule('distributorToRetailer').send({
            from: manufacturerAddress,
            gas: '3000000'
          });
    
        [distributorToRetailerContractAddress] = await mobileManufacturerFactoryInstance.methods.getDeployedDistributorToRetailer().call();
        console.log("distributorToRetailerContractAddress>>>", distributorToRetailerContractAddress)
        distributorToRetailerObj = new web3.eth.Contract(JSON.parse(distributorToRetailer.interface), distributorToRetailerContractAddress);
        res.send("initialized successfully");    
    },

    submitDistributorToRetailerProduct : async(req, res) => {
        var data = req.body;
        var productName = data.productName;
        var distributorShippingLocation = data.distributorShippingLocation;
        var retailerShippingLocation = data.retailerShippingLocation;
        var quantity = data.quantity;
        var salePriceToRetailrer = data.salePriceToRetailrer;
        var additionalInformation = data.additionalInfo;
        var retailerAddress = data.retailerAddress;
        console.log("manufacturerAddress>>>", manufacturerAddress)

        try{
            await distributorToRetailerObj.methods.submitProductInfo(productName, quantity, salePriceToRetailrer, additionalInformation, distributorShippingLocation, retailerShippingLocation, retailerAddress).send({
                from: manufacturerAddress,
                gas : '1000000'
            });
            console.log("success")
            res.send("transaction proceessed successfully");
        }catch(error){
            console.log(error)
            res.send(error);
        }

    }
}