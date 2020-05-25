var magnetURI = require('../mangnetURI.js');
var NanoConnectServer = require('../serverIndex.js')

var nanoConn;
if(process.argv.length > 2)
{

    nanoConn = new NanoConnectServer({magnetURI: "magnet:?xt=urn:btih:"+ String(process.argv[2]).repeat(40) + "&tr=wss%3A%2F%2Ftracker.btorrent.xyz" });
}
else
{
    nanoConn = new NanoConnectServer();
}




console.log("started server")

nanoConn.startClientEvent();

nanoConn.on("data",(message)=>{
    console.log("[server] - got a message");
});