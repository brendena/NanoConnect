var NanoConnectClient = require('../clientMessagesIndex')
var parseNanoMessage = require('../clientParseMessage') 
var wrtc = require('wrtc')



var nanoClient = new NanoConnectClient({port:6881,wrtc:wrtc});
nanoClient.connect();

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function queryDemo() {
    try {
     
        await nanoClient.waitForConnection(); 
        while(true)
        {
          //console.log("sending a message ")
          //var  received = await nanoClient.blocks(["F11285DAFFEDCC1F375C1882FB0B5B453EADCCD19C31B9A443564680C8705174","F11285DAFFEDCC1F375C1882FB0B5B453EADCCD19C31B9A443564680C8705174"]);
          //var  received = await nanoClient.blocks(["4D61B14755D09266152825606115470D0153E1917EDC43D23456BFD2A289C2EC"]);

          //send a failing message
          var  received = await nanoClient._send("block_count")
          //console.log("hello " + parseNanoMessage(received,"block_count"));
          //console.log("received message")
          await sleep(1000);
          break;
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
