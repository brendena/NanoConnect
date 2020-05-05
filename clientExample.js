var NanoConnect = require('./index')

var nanoConn = new NanoConnect();

nanoConn.startClientTransactions();



setTimeout(()=>{
    nanoConn.sendTransaction("testing").then((data)=>{
        console.log("got a message")
        console.log(data)
    });
}, 10000);