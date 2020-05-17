var magnetURI = require('../mangnetURI.js');
var NanoConnectClient = require('../clientMessagesIndex')
var wrtc = require('wrtc')



var nanoClient = new NanoConnectClient(magnetURI, {port:6881,wrtc:wrtc});
nanoClient.connect();

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function queryDemo() {
    try {
     
        await nanoClient.waitForConnection(); 
        console.log("got here")
        while(true)
        {
          console.log("sending a message ")
          var  received = await nanoClient.block_count()

          //send a failing message
          //var  received = await nanoClient._send("block_count",{"test":"sdfsdf"})
          console.log("hello " + received);
          console.log("received message")
          await sleep(1000);
        }
        
    } catch (error) {
      console.error("\nError: " + error.message);
      return
    }
  
  }


queryDemo();

nanoClient.on("functionTest",()=>{
  console.log("i don't know")
});