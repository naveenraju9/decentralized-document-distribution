
const path = require('path');
const solc = require('solc');
const fs = require('fs-extra');

/*module.exports =  {
    compileContrcat : function () {
        // Need to implement
    } 
}*/

const buildPath = path.resolve(__dirname, 'build');
        
        fs.removeSync(buildPath);
        
        const documentStoreContractPath = path.resolve(__dirname, 'contracts', 'DocumentStore.sol');
        
        const documentStoreContractSource = fs.readFileSync(documentStoreContractPath, 'utf8');
        
        const documentStoreContractOutput = solc.compile(documentStoreContractSource, 1).contracts;
        
        fs.ensureDirSync(buildPath);
        
        for(let contract in documentStoreContractOutput) {
            fs.outputJsonSync(
                path.resolve(buildPath, contract.replace(':', '') + '.json'),
                documentStoreContractOutput[contract]
            );
        }