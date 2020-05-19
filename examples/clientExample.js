var NanoConnectClient = require('../clientMessagesIndex')
var wrtc = require('wrtc')



var nanoClient = new NanoConnectClient({port:6881,wrtc:wrtc});
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
          var  received = await nanoClient.blocks(["F11285DAFFEDCC1F375C1882FB0B5B453EADCCD19C31B9A443564680C8705174","F11285DAFFEDCC1F375C1882FB0B5B453EADCCD19C31B9A443564680C8705174"]);
          //var  received = await nanoClient.blocks("[\"F11285DAFFEDCC1F375C1882FB0B5B453EADCCD19C31B9A443564680C8705174\"]");

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