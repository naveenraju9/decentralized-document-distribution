pragma solidity ^0.4.23;


contract MobileManufacturerFactory {
    address[] public deployedManufacturerToDistributorContracts;
    address[] public deployedDistributorToRetailerContracts;

    function createModule(string typeOfUser) public {

        //TODO: need to use switch 
        if (keccak256(typeOfUser) == keccak256("manufacturerToDistributor")) {
            address manufacturerContract = new ManufacturerToDistributor(msg.sender);
            deployedManufacturerToDistributorContracts.push(manufacturerContract);
        } else if (keccak256(typeOfUser) == keccak256("distributorToRetailer")) {
            address distributorContract = new DistributorToRetailer(msg.sender);
            deployedDistributorToRetailerContracts.push(distributorContract);
        }
    }

    function getDeployedManufacturerToDistributor() public view returns (address[]) {
        return deployedManufacturerToDistributorContracts;
    }

    function getDeployedDistributorToRetailer() public view returns (address[]) {
        return deployedDistributorToRetailerContracts;
    }

}


contract ManufacturerToDistributor {
    struct ProductInfo {
        string productName;
        uint quantity;
        uint salePriceToDistributor;
        string additionalInformation;
        string manufacturerShippingLocation;
        address distributorAddress;
    }

    struct ProductName {
        ProductInfo[] productsInfo;
    }

    struct ProductLocation {
        bytes32[] shippingLocations;
    }

    struct Address {
        address[] addressOfDistributor;
    }

    mapping (string=> ProductName) private productsInfo;
    mapping (string=> ProductLocation)  productsLocation;
    mapping (string=> Address) addrrsses;

    address public manufacturerAddress;
    
    function ManufacturerToDistributor(address creatorAddress) public {
        manufacturerAddress = creatorAddress;
    }

    function stringToBytes32(string memory source) constant returns (bytes32 result) {
        bytes memory tempEmptyString = bytes(source);
        if (tempEmptyString.length == 0) {
            return 0x0;
        }

        assembly {
            result := mload(add(source, 32))
        }
    }
    
    function submitProductInfo(string productName, uint quantity, uint salePriceToDistributor, 
    string additionalInformation, string manufacturerShippingLocation, address distributorAddress) public {
        ProductInfo memory pInfo = ProductInfo({
            productName : productName,
            quantity: quantity,
            salePriceToDistributor: salePriceToDistributor,
            additionalInformation: additionalInformation,
            manufacturerShippingLocation: manufacturerShippingLocation,
            distributorAddress: distributorAddress
        });
        
        productsLocation[productName].shippingLocations.push(stringToBytes32(manufacturerShippingLocation));
        addrrsses[productName].addressOfDistributor.push(distributorAddress);
        productsInfo[productName].productsInfo.push(pInfo);
    }

    function getProductByProductName(string pName) public view returns(bytes32[] locations,
        address[] distributorAddresses) {
        // clearValues();
        // ProductInfo[] memory productObj = productsInfo[pName].productsInfo;
        // for (uint i=0; i < productObj.length; i++) {
        //     locationsArr.push(stringToBytes32(productObj[i].manufacturerShippingLocation));
        //     distributorAddrrsses.push(productObj[i].distributorAddress);
        // }
        // return(locationsArr, distributorAddrrsses);

        return (productsLocation[pName].shippingLocations, addrrsses[pName].addressOfDistributor);
    }

    // function clearValues() internal {
    //     locationsArr.length = 0;
    //     distributorAddrrsses.length = 0;
    // }
}


contract DistributorToRetailer {
    struct ProductInfo {
        string productName;
        uint quantity;
        uint salePriceToRetailer;
        string additionalInformation;
        string distributorShippingLocation;
        string retailerShippingLocation;
        address retailerAddress;
    }
    
    struct ProductName {
        ProductInfo[] productsInfo;
    }

    struct DistributorShippingLocation {
        bytes32[] distributorShippingLocations;
    }

    struct RetailorShippingLocation {
        bytes32[] retailorShippingLocations;
    }

    struct Address {
        address[] addressOfRetailor;
    }

    mapping (string=> ProductName) private productsInfo;
    mapping (string=> DistributorShippingLocation)  distributorLocations;
    mapping (string=> RetailorShippingLocation)  retailorLocations;
    mapping (string=> Address) addrrsses;

    address public distributorAddress;
    
    function DistributorToRetailer(address creatorAddress) public {
        distributorAddress = creatorAddress;
    }

    function stringToBytes32(string memory source) constant returns (bytes32 result) {
        bytes memory tempEmptyString = bytes(source);
        if (tempEmptyString.length == 0) {
            return 0x0;
        }

        assembly {
            result := mload(add(source, 32))
        }
    }

    function submitProductInfo(string productName, uint quantity, uint salePriceToRetailer,
    string additionalInformation, string distributorShippingLocation, string retailerShippingLocation,
    address retailerAddress) public {
        ProductInfo memory pInfo = ProductInfo({
            productName : productName,
            quantity: quantity,
            salePriceToRetailer: salePriceToRetailer,
            additionalInformation: additionalInformation,
            distributorShippingLocation: distributorShippingLocation,
            retailerShippingLocation: retailerShippingLocation,
            retailerAddress: retailerAddress
        });
        
        distributorLocations[productName].distributorShippingLocations.push(
            stringToBytes32(distributorShippingLocation));
        retailorLocations[productName].retailorShippingLocations.push(stringToBytes32(retailerShippingLocation));
        addrrsses[productName].addressOfRetailor.push(retailerAddress);
        productsInfo[productName].productsInfo.push(pInfo);
    }
    
    function getProductByProductName(string pName) public view returns(bytes32[] distributorShippingLocations,
    bytes32[] retailorShippingLocations, address[] retailorAddresses) {

        return (distributorLocations[pName].distributorShippingLocations,
        retailorLocations[pName].retailorShippingLocations,
        addrrsses[pName].addressOfRetailor);
    }
}

