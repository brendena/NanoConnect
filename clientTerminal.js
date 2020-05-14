

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
            var returnPromise = null;

            argv.reset();
            argv.version()
                .usage("Nano Connected is a terminal version of the Nano RPC commands")
                .command({
                    command: "account_balance <accountName>",
                    desc: "Returns how many RAW is owned and how many have not yet been received by account.",
                    handler: (argv) => {
                        returnPromise = nanoClient.account_balance(argv.accountName);
                    }
                })
                .command({
                    command: "account_block_count <accountName>",
                    desc: "Get number of blocks for a specific account.",
                    handler: (argv) => {
                        returnPromise = nanoClient.account_block_count(argv.accountName);
                    }
                })
                .command({
                    command: "account_info <accountName> [representative] [weight] [pending]",
                    desc: "Returns frontier, open block, change representative block, balance, last modified timestamp from local database & block count for account",
                    builder: (yargs) => {
                        yargs.positional('representative', {
                            describe: 'returns representative for account',
                            type: 'boolean',
                            default: false
                        }).positional('weight', {
                            describe: 'returns voting weight for account',
                            type: 'boolean',
                            default: false
                        }).positional('pending', {
                            describe: 'returns pending balance for account',
                            type: 'boolean',
                            default: false
                        })
                    },
                    handler: (argv) => {
                        returnPromise = nanoClient.account_info(argv.accountName, argv.representative, argv.weight, argv.pending);
                    }
                })
                .command({
                    command: "account_get <publicKey>",
                    desc: "Get account number for the public key.",
                    handler: (argv) => {
                        returnPromise = nanoClient.account_get(argv.publicKey);
                    }
                })
                .command({
                    command: "account_history <accountName> [count]",
                    desc: "Reports send/receive information for a account.",
                    builder: (yargs) => {
                        yargs.positional('count', {
                            describe: 'Response length',
                            type: 'number',
                            default: 1
                        });
                    },
                    handler: (argv) => {
                        returnPromise = nanoClient.account_history(argv.accountName, 1);
                    }
                })
                .command({
                    command: "account_key <accountName>",
                    desc: "Get the public key for account.",
                    handler: (argv) => {
                        returnPromise = nanoClient.account_key(argv.accountName);
                    }
                })
                .command({
                    command: "account_representative <accountName>",
                    desc: "Get the public key for account.",
                    handler: (argv) => {
                        returnPromise = nanoClient.account_representative(argv.accountName);
                    }
                })
                .command({
                    command: "account_weight <accountName>",
                    desc: "Returns the voting weight for account.",
                    handler: (argv) => {
                        returnPromise = nanoClient.account_weight(argv.accountName);
                    }
                })
                .command({
                    command: "available_supply <accountName>",
                    desc: "Returns how many rai are in the public supply.",
                    handler: (argv) => {
                        returnPromise = nanoClient.available_supply(argv.accountName);
                    }
                })
                .command({
                    command: "block <block>",
                    desc: "Retrieves a json representation of block.",
                    handler: (argv) => {
                        returnPromise = nanoClient.block(argv.block);
                    }
                })
                //going to need verificaiton a list of blocks
                .command({
                    command: "blocks <blocks>",
                    desc: "Retrieves a json representations of blocks.",
                    handler: (argv) => {
                        console.log("*************************************---------")
                        console.log(argv.blocks);
                        returnPromise = nanoClient.blocks(argv.blocks);
                    }
                })
                //lots of options
                .command({
                    command: "block_info <block> [source] [pending]",
                    desc: "Retrieves a json representations of blocks with transaction amount & block account.",
                    builder: (yargs) => {
                        yargs.default('source', false);
                        yargs.default('pending', false);
                    },
                    handler: (argv) => {
                        returnPromise = nanoClient.blocks_info(argv.block, argv.source, argv.pending);
                    }
                })
                .command({
                    command: "block_account <block>",
                    desc: "Returns the account containing block.",
                    handler: (argv) => {
                        returnPromise = nanoClient.block_account(argv.block);
                    }
                })
                .command({
                    command: "block_count",
                    desc: "Reports the number of blocks in the ledger.",
                    handler: () => {
                        returnPromise = nanoClient.block_count();
                    }
                })
                .command({
                    command: "block_count_type",
                    desc: "Reports the number of blocks in the ledger by type.",
                    handler: () => {
                        returnPromise = nanoClient.block_count_type();
                    }
                })
                .command({
                    command: "chain <block> [count]",
                    desc: "Returns a list of block hashes in the account chain starting at block up to count.",
                    builder:(yargs)=>{
                        yargs.positional('representative', {
                            describe: 'Max count of items to return',
                            type: 'number',
                            default: 1
                        });
                    },
                    handler: (argv) => {
                        returnPromise = nanoClient.chain(argv.block,argv.count);
                    }
                })
                .command({
                    command: "frontiers <accountName> [count]",
                    desc: "Returns a list of pairs of account and block hash representing the head block starting at account up to count.",
                    builder:(yargs)=>{
                        yargs.positional('count', {
                            describe: 'How much items to get from the list.',
                            type: 'number',
                            default: 1
                        });
                    },
                    handler: (argv) => {
                        returnPromise = nanoClient.frontiers(argv.accountName, argv.count);
                    }
                })
/*
//unkown command
                //doesn't work????
                .command({
                    command: "frontiers_count",
                    desc: "Reports the number of accounts in the ledger.",
                    handler: (argv) => {
                        returnPromise = nanoClient.frontiers_count();
                    }
                })
*/
                .command({
                    command: "history <block> [count]",
                    desc: "Reports send/receive information for a chain of blocks.",
                    builder:(yargs)=>{
                        yargs.positional('count', {
                            describe: 'How much items to get from the list.',
                            type: 'number',
                            default: 1
                        });
                    },
                    handler: (argv) => {
                        console.log()
                        returnPromise = nanoClient.history(argv.block, argv.count);
                    }
                })
                .command({
                    command: "mrai_from_raw <sizeRaw>",
                    desc: "Divide a raw amount down by the Mrai ratio.",
                    handler: (argv) => {
                        returnPromise = nanoClient.mrai_from_raw(argv.sizeRaw);
                    }
                })
                .command({
                    command: "mrai_to_raw <sizeMrai>",
                    desc: "Multiply an Mrai amount by the Mrai ratio.",
                    handler: (argv) => {
                        returnPromise = nanoClient.mrai_to_raw(argv.sizeMrai);
                    }
                })
                .command({
                    command: "krai_from_raw <sizeRaw>",
                    desc: "Divide a raw amount down by the krai ratio.",
                    handler: (argv) => {
                        returnPromise = nanoClient.krai_from_raw(argv.sizeRaw);

                    }
                })
                .command({
                    command: "krai_to_raw <sizeKrai>",
                    desc: "Multiply an krai amount by the krai ratio.",
                    handler: (argv) => {
                        returnPromise = nanoClient.krai_to_raw(argv.sizeKrai);
                    }
                })
                .command({
                    command: "rai_from_raw <sizeRaw>",
                    desc: "Divide a raw amount down by the rai ratio.",
                    handler: (argv) => {
                        returnPromise = nanoClient.rai_from_raw(argv.sizeRaw);

                    }
                })
                .command({
                    command: "rai_to_raw <sizeRai>",
                    desc: "Multiply an rai amount by the rai ratio.",
                    handle: (argv) => {
                        returnPromise = nanoClient.rai_to_raw(argv.sizeRai);
                    }
                })
            
/*
//currently disabled
                .command({
                    command: "ledger <accountName> [count] [representative] [weight] [pending] [sorting]",
                    desc: "Returns frontier, open block, change representative block, balance, last modified timestamp from local database & block count for account",
                    builder: (yargs) => {
                        yargs.positional('count', {
                            describe: 'Defines from where results are returned',
                            type: 'number',
                            default: 1
                        }).positional('representative', {
                            describe: 'Additionally returns representative for each account',
                            type: 'boolean',
                            default: false
                        }).positional('weight', {
                            describe: 'Additionally returns voting weight for each account',
                            type: 'boolean',
                            default: false
                        }).positional('pending', {
                            describe: 'Additionally returns voting weight for each account',
                            type: 'boolean',
                            default: false
                        }).positional('sorting', {
                            describe: 'Sort the results by DESC',
                            type: 'boolean',
                            default: false
                        })
                    },
                    handler: (argv) => {
                        returnPromise = nanoClient.ledger(argv.accountName, argv.representative, argv.weight, argv.pending, argv.sorting);
                    }
                })
*/
/* caused a unkown failer
                .command({
                    command: "representatives",
                    desc: "Returns a list of pairs of representative and its voting weight.",
                    handle: (argv) => {
                        returnPromise = nanoClient.representatives(2,1);
                    }
                })
*/
                .help('h')
                .alias('h', 'help').
                parse(arguments, (_err, argv, output) => {
                    if (output != "") {
                        output = output.split("\n").join("\r\n");
                        output += "\r\n";
                        resolve(output);
                    }

                    console.log(output)
                });

            if (returnPromise == null) {
                reject("ERROR:Not a command");
            }
            else {
                returnPromise.then((message) => {
                    if (message != "") {
                        var messageString = message.toString();
                        console.log(messageString)
                        messageString = messageString.split("\n").join("\r\n");
                        messageString += "\r\n";
                        resolve(messageString);
                    }
                    else {
                        reject("ERROR:no message")
                    }
                });
            }


        } catch (error) {
            console.error("\nError: " + error.message);
            reject("Error: " + error.message)
            return
        }
    });
}

module.exports = executeNanoTerminal