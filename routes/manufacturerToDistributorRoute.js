const Web3 = require('../ethereum/createWeb3');
const web3 = Web3.getWeb3Instance();
const initializeData = require('./initializeRoute');


const manufacturerToDistributor = require('../ethereum/build/ManufacturerToDistributor.json');
//const distributorToRetailer = require('../ethereum/build/DistributorToretailer.json');
//const ManufacturerToDistributor =  require('../ethereum/manufacturerToDistributor');

const MobileManufacturerFactory = require('../ethereum/mobileManufacturerFactory')

//const mobileManufacturerFactory = require('../ethereum/build/MobileManufacturerFactory.json')

let manufacturerAddress;
let manufacturerToDistributorContractAddress;
let manufacturerToDistributorObj;
let mobileManufacturerFactoryInstance;

module.exports = {

    initializeContract : async(req, res) => {
        manufacturerAddress = await initializeData.getManufacturerAddress();
        mobileManufacturerFactoryInstance = MobileManufacturerFactory.getInstance();
    
        await mobileManufacturerFactoryInstance.methods.createModule('manufacturerToDistributor').send({
            from: manufacturerAddress,
            gas: '3000000'
          });
    
        [manufacturerToDistributorContractAddress] = await mobileManufacturerFactoryInstance.methods.getDeployedManufacturerToDistributor().call();
        manufacturerToDistributorObj = new web3.eth.Contract(JSON.parse(manufacturerToDistributor.interface), manufacturerToDistributorContractAddress);    
        res.send("initialized sucessfully");
    },

    submitManufacturerToDistributorProduct : async(req, res) => {
        var data = req.body;
        var productName = data.productName;
        var quantity = data.quantity;
        var salePriceToDistributor = data.salePriceToDistributor;
        var additionalInformation = data.additionalInfo;
        var manufacturerShippingLocation = data.shippingLocation;
        var distributorAddress = data.distributorAddress;
    
        try{
            await manufacturerToDistributorObj.methods.submitProductInfo(productName, quantity, salePriceToDistributor, additionalInformation, manufacturerShippingLocation, distributorAddress).send({
                from: manufacturerAddress,
                gas : '3000000'
            });
            res.send("transaction proceessed successfully");
        }catch(error){
            console.log(error)
            res.send(error);
        }

    }
}