var express  = require('express');
var app      = express(); 
var bodyParser = require('body-parser');
var path = require('path');
var multer  = require('multer');
var fs = require('fs');
var IPFS = require('./ipfs')
var ipfs = IPFS.getIPFSObj();
var compileScript = require('./ethereum/compile')
var deployScript = require('./ethereum/deploy')
var imageDataService = require('./services/getImageDataService')
var promise = require('promise')
var ipfs_mini = IPFS.getIPFSMINIObj();
var _ = require('lodash');




var userHandler = require('./routes/user-registration')


let contractAddress = null;
let contractInstance = {};


var compileAnddeployContract = async() => {
    //compileScript.compileContrcat();
    contractInstance = await deployScript.deployContract();
    //console.log("contractInstance>>>",contractInstance)
    contractAddress = contractInstance._address;

    userHandler.deployUserContrcat();
}

var storage = multer.diskStorage({
    destination: './uploads/',
    filename: function (req, file, cb) {
      cb(null, file.originalname.replace(path.extname(file.originalname), "") + '-' + Date.now() + path.extname(file.originalname))
    }
  })

var upload = multer({ storage: storage })  

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json({ type: 'application/json' }));

app.post('/registerUser', userHandler.registerUser);
app.get('/loginUser', userHandler.loginUser);
app.get('/getDocumentListByPurpose', userHandler.getDocumentListByPurpose);
app.get('/getUserDetailsByUserId', userHandler.getUserDetailsByUserId);
app.get('/getDocumentDetailsByUserId', userHandler.getDocumentDetailsByUserId);

app.post('/createPurpose', userHandler.createPurpose);
app.post('/subscribe', userHandler.subscribe);


function getDocumentObject(idType, idNumber, documentHash){
    return {
      "idType" : idType,
      "idNumber" : idNumber,
      "documentHash" : documentHash
    };
}

function getDocumentHashByUserId(userAddress){
  var docHash = userHandler.getDocumentHashByUserId(userAddress);
  return docHash;
}

var getUserDocumentsFromIPFS = async(docHash, callback) => {
  console.log("docHash>>>", docHash)
      if (!_.isEmpty(docHash)){
        await ipfs.cat(docHash, (err, documentsRes) => {
          if (err){
            return err;
          }
          console.log("docs>>>>", JSON.parse(documentsRes.toString('utf8')));
          callback(JSON.parse(documentsRes.toString('utf8')).documents);
        });
      } else {
        callback([]);
      }
}

function updateDocumentHash(userAddress, hash){
    var status = userHandler.updateDocumentHash(userAddress, hash);
    return status;
}


app.post('/savedata', upload.single('file'), function(req, res, next){
  console.log("req.file.path>>>", req.file)
    imageDataService.processImage('karthik', req.body.documentType, req.file.path, './uploads/extract.json').then(function(responseData){
        console.log("req>>>>>>",req.body)
        var idType = req.body.documentType;
        var idNumber = responseData.EXTRACTED_INFO.aadharID;
        var userAddress = req.body.address;

        const data = fs.readFileSync(req.file.path);
        console.log("data>>>>", data)
        return ipfs.add(data, (err, files) => {
            fs.unlink(req.file.path);
            if (files) {
              var hash = files[0].hash;
              console.log("document hash>>>>", hash)

              var document  = getDocumentObject(idType, idNumber, hash);


              return getDocumentHashByUserId(userAddress).then((documentHash) => {
                
                return getUserDocumentsFromIPFS(documentHash, function(documentRes){
                  console.log(documentRes);
                  documentRes.push(document);
                  
                  var documentObj = JSON.stringify({
                    "documents": documentRes
                  });

                  console.log("documentObj>>>", documentObj)
                    return ipfs.add(Buffer.from(documentObj), (err, result) => {
                      console.log("document hash>>>", result[0].hash)
                        updateDocumentHash(userAddress, result[0].hash).then((status)=>{
                          if(status){
                            return res.send({status: true,message: 'Document has been uploaded successfully'});
                          } 
                          return res.status(500).json({
                            error: err,
                          });

                        });
                    });
                  
                })
              });
            }
            if (err){
              return res.status(500).json({
                error: err,
              });
            }

          });
    })
})


app.listen(3000, function(res){
    console.log("Application is running on 3000 port");
    compileAnddeployContract();
});