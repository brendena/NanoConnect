var NanoConnectClient = require('./clientIndex')


var nanoClient = new NanoConnectClient();

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function queryDemo() {
    try {
     
        await nanoClient.connect();
        console.log("got here")
        while(true)
        {
          var  received = await nanoClient.sendMessage("testing this out")
          console.log("hello " + received);
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