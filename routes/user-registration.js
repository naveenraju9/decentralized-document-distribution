const Web3 = require('../ethereum/createWeb3');
var IPFS = require('../ipfs');
var deployScript = require('../ethereum/deploy');
var _ = require('lodash');

const web3 = Web3.getWeb3Instance();
var ipfs = IPFS.getIPFSObj();
var ipfs_mini = IPFS.getIPFSMINIObj();

const userContract = require('../ethereum/build/User.json');

var userContractResult = {};
var userContractOwnerAddress = null;

var deployUserContrcat = async() => {
        let accounts = await web3.eth.getAccounts();
        userContractOwnerAddress = accounts[0];
        
        userContractResult = await new web3.eth.Contract(JSON.parse(userContract.interface))
        .deploy({data : userContract.bytecode})
        .send({gas : '3000000', from : userContractOwnerAddress}); // need to implement get the gas dynamically
        return userContractResult;
}

/*function getUserObject(user, email, name, userId) {
    var obj = {
        userId : userId,
        address : user.address,
        name : name,
        email : email,
        documents : []
    };
    return obj;
}*/

var generateUserId = function (email, address){
    var combinedString = email + address;
    var randomStr = web3.utils.sha3(combinedString);
    return randomStr;
} 

var getDocumentsObjectFromIPFS = async(documentHash, callback)=> {
    await ipfs.cat(documentHash, (err, result) => {
        console.log("result>>>", result)
        if(err){
            throw err;
        }
        callback(JSON.parse(result.toString('utf8')));
      }); 
};

var appendIPFSUrlToHash = function(docObj) {
    _.forEach(docObj, function(doc){
        doc.documentHash = "http://localhost:8080/ipfs/"+doc.documentHash;
    });
    return docObj;
};

module.exports = {
    deployUserContrcat : async(request, response) => {
        deployUserContrcat();
    },
    registerUser : async(request, response) => {
        var email = request.body.email;
        var name = request.body.firstName;
        var password = request.body.password;
        var role = request.body.role;
        //var user = await web3.eth.accounts.create(email);
        var userAccount = await web3.eth.personal.newAccount(password);
        //var userId = generateUserId(email, userAccount);

        userContractResult.methods.registerUserDetails(name, email, userAccount, parseInt(role), "").send({ from: userContractOwnerAddress,gas : '1000000' }).then((result) => {
            
          })



        //var userDetails = getUserObject(user, email, name, userId);

        //const buf = Buffer.from(JSON.stringify(userDetails));
        
        /*await ipfs.block.put(buf, (err, ipfsHash) => {
            if(err){
                return response.status(500).json({
                    error: err,
                  });
            }

            console.log(ipfsHash.data.toString())

            console.log(ipfsHash.cid)

            userContractResult.methods.setUserHash(user.address, ipfsHash.cid).send({ from: userContractOwnerAddress,gas : '1000000' }).then((result) => {
                console.log("result>>>>", result);

                userContractResult.methods.getUserHash(user.address).call().then((res) => {
                    console.log("res>>>>", res)
                })
              })
          });*/
        // console.log("responseData>>>>", responseData);
        /*var uniqueId = web3.utils.sha3(email)
        web3.eth.personal.newAccount(email).then(function(key){
            console.log("key>>>", key);
        })*/
        response.send({id : userAccount, message:'User has been created successfully'});
    },

    loginUser : async(request, response) => {
        var password = request.query.password;
        var username = request.query.username;

        console.log("password>>>",password,username)

        var userAccount = await userContractResult.methods.getUserAccount(username).call();
        await web3.eth.personal.unlockAccount(userAccount, password);
        var userDetails = await userContractResult.methods.getUserDetails(userAccount).call();

        console.log("userDetails>>>>", userDetails)
        response.send({name: userDetails.name, email:userDetails.email, address: userDetails.userAddress, role:userDetails.role});
    },
    getDocumentHashByUserId : async(userId) => {
        console.log("userId>>>>>>", userId);
        var hash = await userContractResult.methods.getDocumentHashByUserId(userId).call();
        console.log("hash>>>>>>>>>>>", hash);
        return hash;
    },
    updateDocumentHash : async(userId, hash) => {
        console.log("hash of document>>>", hash)
        var status = await userContractResult.methods.updateDocumentHash(userId, hash).send({ from: userContractOwnerAddress,gas : '1000000' });
        return status;
    },
    getDocumentListByPurpose : async(request, response) => {
        var purpose = request.query.purpose;

        var documents = [
            {
                "name" : "Create new Bank account",
                "code" : "CA",
                "documents" : [
                    {
                        "name" : "Aadhar Card",
                        "code" : "aadhar",
                        "isRequired" : true
                    },
                    {
                        "name" : "Pan Card",
                        "code" : "pan",
                        "isRequired": false
                    }
                ]
            },
            {
                "name" : "HDFC Click2 invesment",
                "code" : "HDFCC2",
                "documents" : [
                    {
                        "name" : "Aadhar Card",
                        "code" : "aadhar",
                        "isRequired" : true
                    },
                    {
                        "name" : "Driving Licence",
                        "code" : "DL",
                        "isRequired": false
                    }
                ]
            },
            {
                "name" : "MaxLife Term insurance",
                "code" : "MLTI",
                "documents" : [
                    {
                        "name" : "Aadhar Card",
                        "code" : "aadhar",
                        "isRequired" : true
                    },
                    {
                        "name" : "Voter ID",
                        "code" : "VID",
                        "isRequired": false
                    }
                ]
            }
        ];

        var document = _.find(documents, function(document){
            return document.code === purpose;
        })

        return response.send({documents : document})
    },

    getUserDetailsByUserId: async(request, response) => {
        var userId = request.query.userId;
        var userDetails = await userContractResult.methods.getUserDetails(userId).call();
        response.send({name: userDetails.name, email:userDetails.email, address: userDetails.userAddress, passCode: userId});
    },

    getDocumentDetailsByUserId: async(request, response) => {
        var userId = request.query.userId;
        var documentHash = await userContractResult.methods.getDocumentHashByUserId(userId).call();
        return await getDocumentsObjectFromIPFS(documentHash, function(documentsObj){
            
            var docsObj = appendIPFSUrlToHash(documentsObj.documents);
            console.log("documentsObj>>>>", docsObj);
            return response.send(docsObj);
        })
    },
    createPurpose : async(request, response) => {
        var userId = request.body.userId;
        var purpose = request.body.purpose;
        console.log("userId>>>>>>>>", userId, purpose)

        userContractResult.methods.createPurpose(userId, purpose).send({from: userContractOwnerAddress, gas : '1000000'}).then((result) => {
            console.log("result>>>>",result)
        });

        response.send({message:'Purpose has been created successfully'});

    },

    subscribe : async(request, response) => {
        var passcode = request.body.passcode;
        var purpose = request.body.purpose;
        var email = request.body.email;
        console.log("request>>>", request)


        console.log("userContractResult>>>",userContractResult)



        var recommenderId = await userContractResult.methods.getUserIdBasedOnPurpose(purpose).call();
        console.log("recommenderId>>>>", recommenderId)
        //sendNotification(passcode, purpose, recommenderId, email);
    }

}