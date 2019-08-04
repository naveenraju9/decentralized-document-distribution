const { spawn } = require('child_process');
var Promise = require('promise');
var sys   = require('sys')

module.exports = {
    processImage : function(uploadedBy, cardType, imageFile, outputPath, callback) {
        var mockResObj = {
            "EXTRACTED_INFO": {
              "aadharID": "5643 8288 1574"
            }, 
            "STATUS": "SUCCESS", 
            "TIMESTAMP": "2018-09-10 10:02:22.495649", 
            "TOTAL_TIME_TAKEN": "11.4643900394 seconds"
          };
          
        return new Promise(function(resolve, reject){
            resolve(mockResObj);
        });  
    }
}