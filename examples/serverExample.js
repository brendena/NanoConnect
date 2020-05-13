var magnetURI = require('../mangnetURI.js');

var NanoConnectServer = require('../serverIndex.js')

var nanoConn = new NanoConnectServer(magnetURI);

console.log("started server")

nanoConn.startClientEvent();

nanoConn.on("data",(message)=>{
    console.log("[server] - got a message");
});