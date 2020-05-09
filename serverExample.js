var NanoConnectServer = require('./serverIndex.js')

var nanoConn = new NanoConnectServer();

nanoConn.startClientEvent();

nanoConn.on("data",(message)=>{
    console.log("[server] - got a message");
});