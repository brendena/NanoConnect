

var yargs = require('yargs')

var argv = yargs.locale("en")

var NanoConnectClient = require('./clientMessagesIndex')


var nanoClient = new NanoConnectClient();


var arguments = process.argv.slice(2);
console.log(process.argv.slice(2))



async function terminalDemo(arguments) {
    try {

        await nanoClient.connect();
        console.log("got here")
        console.log(arguments)
        //var  received = await nanoClient.block_count()
        //console.log("hello " + received);
        var returnPromise;
        argv.command("block_count", "Reports the number of blocks in the ledger.", ()=>{
                returnPromise = nanoClient.block_count();
            })
            .command("block_count_type", "Reports the number of blocks in the ledger by type.", ()=>{
                returnPromise = nanoClient.block_count_type();
            })
            .command("rai_to_raw", "Multiply an rai amount by the rai ratio.", ()=>{
                returnPromise = nanoClient.rai_to_raw(100);
            }).help().
            parse(arguments, (_err, argv, output) => {
                if (output != "") {
                    console.log(output)
                    output = output.split("\n").join("\r\n");
                    output += "\r\n";
                    returnOutput = output;
                }
        
                console.log(output)
            });
        
        console.log(returnPromise);
        await returnPromise.then((message)=>{
            console.log("hello " + message);
        });


        nanoClient.disconnect();


    } catch (error) {
        console.error("\nError: " + error.message);
        return
    }

}


terminalDemo(arguments);
nanoClient.on("functionTest",()=>{
    console.log("i don't know")
});