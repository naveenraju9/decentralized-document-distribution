var module = angular.module('mobileManufacturerApp', ['ngRoute']);

module.config(function($routeProvider) {
    $routeProvider
        .when('/manufacturerToDistributor', {
            templateUrl : 'pages/manufacturerToDistributor.html',
            controller  : 'manufacturerToDistributorController'
        })
        .when('/distributorToRetailer', {
            templateUrl : 'pages/distributorToRetailer.html',
            controller  : 'distributorToRetailerController'
        })
        .when('/consumer', {
            templateUrl: 'pages/consumer.html',
            controller: 'consumerController'
        })
        ;
});

module.controller('manufacturerToDistributorController', function($scope, $http) {

    //TODO : move the common reusable things to service to avoid boilerplate code
    $scope.productNames = [
       'Motorola', 'honor', 'Apple'
    ];

    $scope.shippingLocations = [
        'Bangalore', 'Hyderabad'
    ];

    $scope.distributorAddresses = [];

    $http.get("http://localhost:3000/getDistributorAddress").then(function(distributorAddresses){
        if (angular.isDefined(distributorAddresses)) {
            $scope.distributorAddresses = distributorAddresses.data;
        }
    });

    $http.get("http://localhost:3000/initializeManufacturerToDistributorContract").then(function(response){
        console.log(response)
    });

    $scope.submitManufacturerToDistributor = function() {
        var requestPayload = {
            productName : $scope.productName,
            shippingLocation : $scope.shippingLocation,
            quantity : $scope.quantity,
            salePriceToDistributor : $scope.salePriceToDistributor,
            additionalInfo : $scope.additionalInfo,
            distributorAddress: $scope.distributorAddress
        };

        $scope.messge = "Please wait your transaction is processing";

        $http.post('http://localhost:3000/submitManufacturerToDistributorProduct', requestPayload).then(function(response){
            console.log("response>>>", response)
            if (response) {
                $scope.messge = response.data;
                resetValues();
            }
        })
        console.log("inside submitManufacturerToDistributor")
    };

    function resetValues() {
        $scope.productName = '';
        $scope.shippingLocation = '';
        $scope.quantity ='';
        $scope.salePriceToDistributor = '';
        $scope.additionalInfo = '';
        $scope.distributorAddress = ''
    }
});

module.controller('distributorToRetailerController', function($scope, $http) {

    //TODO : move the common reusable things to service to avoid boilerplate code
    $scope.productNames = [
        'Motorola', 'honor', 'Apple'
     ];
 
     $scope.shippingLocations = [
         'Bangalore', 'Hyderabad'
     ];
 
     $scope.distributorAddresses = [];
 
     $http.get("http://localhost:3000/getRetailerAddresses").then(function(retailerAddresses){
         if (angular.isDefined(retailerAddresses)) {
             $scope.retailerAddresses = retailerAddresses.data;
         }
     });

     $http.get("http://localhost:3000/initializedistributorToRetailerContract").then(function(response){
        if (angular.isDefined(response)) {
            console.log(response.data)
        }
    });
 
     $scope.submitDistributorToRetailer = function() {
         var requestPayload = {
             productName : $scope.productName,
             distributorShippingLocation : $scope.distributorShippingLocation,
             retailerShippingLocation: $scope.retailerShippingLocation,
             quantity : $scope.quantity,
             salePriceToRetailrer : $scope.salePriceToRetailrer,
             additionalInfo : $scope.additionalInfo,
             retailerAddress: $scope.retailerAddress
         };
 
         $scope.messge = "Please wait your transaction is processing";
 
         $http.post('http://localhost:3000/submitDistributorToRetailerProduct', requestPayload).then(function(response){
             if (response) {
                 $scope.messge = response.data;
                 resetValues();
             }
         })
     };
 
     function resetValues() {
         $scope.productName = '';
         $scope.distributorShippingLocation = '';
         $scope.retailerShippingLocation = '';
         $scope.quantity ='';
         $scope.salePriceToRetailrer = '';
         $scope.additionalInfo = '';
         $scope.retailerAddress = ''
     }
});

module.controller('consumerController', function($scope, $http) {
    $scope.productNames = [
        'Motorola', 'honor', 'Apple'
     ];
     $scope.productsInfo = [];
    $http.get("http://localhost:3000/initializeConsumerContract").then(function(response){
        if (angular.isDefined(response)) {
            console.log(response.data)
        }
    });   

     $scope.getProductsInformation = function(){
         var productName = $scope.productName;
        
         $http.get('http://localhost:3000/getProductInformation', {params: {productName: productName}}
         ).then(function(productsInfo){
            $scope.productsInfo = productsInfo.data;
         });
     }
});
