var NanoConnectClient = require('../clientMessagesIndex')
var executeNanoTerminal = require('../clientTerminal')
var magnetURI = require('../mangnetURI.js');
var wrtc = require('wrtc')

var nanoClient = new NanoConnectClient({port:6881,wrtc:wrtc});
nanoClient.connect();

async function terminalLoop(arguments) {
    try {

        if(!nanoClient.connectedToServer())
        {
            await nanoClient.waitForConnection();
        }
        var returnString = await executeNanoTerminal(nanoClient,arguments);
        console.log("got back" + returnString);



    } catch (error) {
        console.error("\nError: " + error.message);
        return
    }





process.stdin.on('data',function(chunk){
    console.log(chunk.toString())
    terminalLoop(chunk.toString());
})



}

var arguments = process.argv.slice(2);
terminalLoop(arguments);



nanoClient.on("functionTest", () => {
    console.log("i don't know")
});
setTimeout(function(){
    console.log("test");
},1000000000  )