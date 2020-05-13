

var yargs = require('yargs')

var argv = yargs.locale("en")




//pass in the nanoClient,params ->string 
function executeNanoTerminal(nanoClient, arguments) {
    return new Promise((resolve, reject) => {
        try {
            console.log("got here")
            console.log(arguments)
            //var  received = await nanoClient.block_count()
            //console.log("hello " + received);
            var returnPromise;
            argv.command("block_count", "Reports the number of blocks in the ledger.", () => {
                returnPromise = nanoClient.block_count();
            })
                .command("block_count_type", "Reports the number of blocks in the ledger by type.", () => {
                    returnPromise = nanoClient.block_count_type();
                })
                .command("rai_to_raw", "Multiply an rai amount by the rai ratio.", (yarg) => {
                    if (yarg.argv._.length == 2) {
                        returnPromise = nanoClient.rai_to_raw(yarg.argv._[1]);
                    }
                }).help('h')
                .alias('h', 'help').
                parse(arguments, (_err, argv, output) => {
                    if (output != "") {
                        console.log(output)
                        output = output.split("\n").join("\r\n");
                        output += "\r\n";
                        returnOutput = output;
                    }

                    console.log(output)
                });

            returnPromise.then((message) => {
                resolve(message);
            });



        } catch (error) {
            console.error("\nError: " + error.message);
            reject("Error: " + error.message)
            return
        }
    });
}

module.exports = executeNanoTerminal