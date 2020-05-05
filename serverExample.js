var NanoConnect = require('./index')

var nanoConn = new NanoConnect();

nanoConn.startClientEvent();

nanoConn.on("data",(message)=>{
    console.log("[server] - got a message");
    nanoConn.sendMessage(message);
});