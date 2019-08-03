var express  = require('express');
var app      = express(); 
var bodyParser = require('body-parser');

var manufacturerToDistributorHandler = require('./routes/manufacturerToDistributorRoute');
var distributorToRetailerHandler = require('./routes/distributorToRetailerRoute');
var initialzeRouteHandler = require('./routes/initializeRoute');
var consumerHandler = require('./routes/consumer');


app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json({ type: 'application/json' }));

function initializeData(){
    initialzeRouteHandler.initializeData();
}

initializeData();

app.get('/initializeManufacturerToDistributorContract', manufacturerToDistributorHandler.initializeContract);
app.get('/getDistributorAddress', initialzeRouteHandler.getDistributorAddress);
app.post('/submitManufacturerToDistributorProduct', manufacturerToDistributorHandler.submitManufacturerToDistributorProduct);

app.get('/initializedistributorToRetailerContract', distributorToRetailerHandler.initializeContract);
app.get('/getRetailerAddresses', initialzeRouteHandler.getRetailerAddresses);
app.post('/submitDistributorToRetailerProduct', distributorToRetailerHandler.submitDistributorToRetailerProduct);

app.get('/initializeConsumerContract', consumerHandler.initializeContract);
app.get('/getProductInformation', consumerHandler.getProductsInformation);
app.listen(3000);

console.log("Application is listening on port 3000");