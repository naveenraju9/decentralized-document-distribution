const IPFS = require('ipfs-api');
const IPFSMINI = require('ipfs-mini');

let ipfs = null;
let ipfs_mini = null;
module.exports = {
    getIPFSObj : function(){
        if (ipfs === null) {
            ipfs = new IPFS({ host: '127.0.0.1', port: 5001, protocol: 'http' });

            //ipfs = new IPFS({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });
        } 
        return ipfs;
    },
    getIPFSMINIObj : function(){
        if (ipfs_mini === null) {
            ipfs_mini = new IPFSMINI({ host: '127.0.0.1', port: 5001, protocol: 'http' });
        }
        return ipfs_mini;
    }
};