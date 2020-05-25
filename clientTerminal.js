
var yargs = require('yargs')
var argv = yargs.locale("en")
var NanoParseMessage  = require('./clientParseMessage')



//pass in the nanoClient,params ->string 
function executeNanoTerminal(nanoClient, arguments) {
    return new Promise((resolve, reject) => {
        try {
            console.log("got here")
            console.log(arguments)
            //var  received = await nanoClient.block_count()
            //console.log("hello " + received);
            var returnPromise = null;
            var messageType = "";

            argv.reset();
            argv.version()
                .usage
                (`Nano Connected is a terminal version of the Nano RPC commands
[usefull terms] \n
[accountAddress] - is a 65 character string that start's with nano and it's what you send Nano to.  
(EX) - nano_1usgjpeyud4zpgop1oi5as6a9pfxnn87n4iss473d177n3fn1pyp96znu67j
[block] - block is a 64 characters that contains the state of the nano wallet.
(EX) - F11285DAFFEDCC1F375C1882FB0B5B453EADCCD19C31B9A443564680C8705174
(help) - use account_history <accountAddress> to get block's.  It will be the hash property.`)
                .command({
                    command: "getting_started",
                    desc: "Give you a few instruction to get started using Nano.",
                    handler: (argv) => {
                        resolve(`[getting started]\r
You can create a wallet at nanowallet.io\r
Once created on the home screen on the right the'll be a Nano address\r
You can put your nano's address here https://www.freenanofaucet.com/ \r
to get a some free nano.\r
Then you can see your account balance with the bellow command. \r
account_balance <accountAddress> \r\n\n`);
                    }
                })
                .command({
                    command: "account_balance <accountAddress>",
                    desc: "Returns how many RAW is owned and how many have not yet been received by account.",
                    handler: (argv) => {
                        returnPromise = nanoClient.account_balance(argv.accountAddress);
                        messageType = "account_balance";
                    }
                })
                .command({
                    command: "account_block_count <accountAddress>",
                    desc: "Get number of blocks for a specific account.",
                    handler: (argv) => {
                        returnPromise = nanoClient.account_block_count(argv.accountAddress);
                        messageType = "account_block_count";
                    }
                })
                .command({
                    command: "account_info <accountAddress> [representative] [weight] [pending]",
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
                        returnPromise = nanoClient.account_info(argv.accountAddress, argv.representative, argv.weight, argv.pending);
                        messageType = "account_info";
                    }
                })
                .command({
                    command: "account_get <publicKey>",
                    desc: "Get account address.",
                    handler: (argv) => {
                        returnPromise = nanoClient.account_get(argv.publicKey);
                        messageType = "account_get";
                    }
                })
                .command({
                    command: "account_history <accountAddress> [count]",
                    desc: "Reports send/receive information for a account.",
                    builder: (yargs) => {
                        yargs.positional('count', {
                            describe: 'Response length',
                            type: 'number',
                            default: 1
                        });
                    },
                    handler: (argv) => {
                        returnPromise = nanoClient.account_history(argv.accountAddress, argv.count);
                        messageType = "account_history";
                    }
                })
                .command({
                    command: "account_key <accountAddress>",
                    desc: "Get the public key for account.",
                    handler: (argv) => {
                        returnPromise = nanoClient.account_key(argv.accountAddress);
                        messageType = "account_key";
                    }
                })
                .command({
                    command: "account_representative <accountAddress>",
                    desc: "Returns the representative for account.",
                    handler: (argv) => {
                        returnPromise = nanoClient.account_representative(argv.accountAddress);
                        messageType = "account_representative";
                    }
                })
                .command({
                    command: "account_weight <accountAddress>",
                    desc: "Returns the voting weight for account.",
                    handler: (argv) => {
                        returnPromise = nanoClient.account_weight(argv.accountAddress);
                        messageType = "account_weight";
                    }
                })
                .command({
                    command: "available_supply",
                    desc: "Returns how many rai are in the public supply.",
                    handler: (argv) => {
                        returnPromise = nanoClient.available_supply(argv.accountAddress);
                        messageType = "available_supply";
                    }
                })
                .command({
                    command: "block <block>",
                    desc: "Retrieves a json representation of block.",
                    handler: (argv) => {
                        returnPromise = nanoClient.block(argv.block);
                        messageType = "block";
                    }
                })
                //going to need verificaiton a list of blocks
                .command({
                    command: "blocks <blocks>",
                    desc: "Retrieves a json representations of blocks.",
                    builder: (yargs) => {
                        yargs.positional('blocks', {
                            describe: 'A list of block hashes',
                            type: 'array',
                            default: []
                        })
                    },
                    handler: (argv) => {
                        //split array
                        argv.blocks = argv.blocks.replace("[","");
                        argv.blocks = argv.blocks.replace("]","");
                        argv.blocks = argv.blocks.split(",")

                        returnPromise = nanoClient.blocks(argv.blocks);
                        messageType = "blocks";
                    }
                })
                .example("blocks","blocks [F11285DAFFEDCC1F375C1882FB0B5B453EADCCD19C31B9A443564680C8705174]")
                //lots of options
                .command({
                    command: "blocks_info <blocks> [source] [pending]",
                    desc: "Retrieves a json representations of blocks with transaction amount & block account.",
                    builder: (yargs) => {
                        
                        yargs.positional('blocks', {
                            describe: 'A list of block hashes',
                            type: 'array',
                            default: []
                        })
                        yargs.default('source', false);
                        yargs.default('pending', false);
                        
                    },
                    handler: (argv) => {
                        argv.blocks = argv.blocks.replace("[","");
                        argv.blocks = argv.blocks.replace("]","");
                        argv.blocks = argv.blocks.split(",")
                        returnPromise = nanoClient.blocks_info(argv.blocks, argv.source, argv.pending);
                        messageType = "blocks_info";
                    }
                })
                .example("blocks_info","blocks_info [F11285DAFFEDCC1F375C1882FB0B5B453EADCCD19C31B9A443564680C8705174] true false")
                .command({
                    command: "block_account <block>",
                    desc: "Returns the account containing block.",
                    handler: (argv) => {
                        returnPromise = nanoClient.block_account(argv.block);
                        messageType = "block_account";
                    }
                })
                .command({
                    command: "block_count",
                    desc: "Reports the number of blocks in the ledger and unchecked synchronizing blocks.",
                    handler: () => {
                        returnPromise = nanoClient.block_count();
                        messageType = "block_count";
                    }
                })
                .command({
                    command: "block_count_type",
                    desc: "Reports the number of blocks in the ledger by type (send, receive, open, change).",
                    handler: () => {
                        returnPromise = nanoClient.block_count_type();
                        messageType = "block_count_type";
                    }
                })
                .command({
                    command: "chain <block> [count]",
                    desc: "Returns a list of block hashes in the account chain starting at block up to count.",
                    builder: (yargs) => {
                        yargs.positional('representative', {
                            describe: 'Max count of items to return',
                            type: 'number',
                            default: 1
                        });
                    },
                    handler: (argv) => {
                        returnPromise = nanoClient.chain(argv.block, argv.count);
                        messageType = "chain";
                    }
                })
                .command({
                    command: "frontiers <accountAddress> [count]",
                    desc: "Returns a list of pairs of account and block hash representing the head block starting at account up to count.",
                    builder: (yargs) => {
                        yargs.positional('count', {
                            describe: 'How much items to get from the list.',
                            type: 'number',
                            default: 1
                        });
                    },
                    handler: (argv) => {
                        returnPromise = nanoClient.frontiers(argv.accountAddress, argv.count);
                        messageType = "frontiers";
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
                    builder: (yargs) => {
                        yargs.positional('count', {
                            describe: 'How much items to get from the list.',
                            type: 'number',
                            default: 1
                        });
                    },
                    handler: (argv) => {
                        returnPromise = nanoClient.history(argv.block, argv.count);
                        messageType = "history";
                    }
                })
                .command({
                    command: "mrai_from_raw <sizeRaw>",
                    desc: "Divide a raw amount down by the Mrai ratio.",
                    handler: (argv) => {
                        returnPromise = nanoClient.mrai_from_raw(argv.sizeRaw);
                        messageType = "mrai_from_raw";
                    }
                })
                .command({
                    command: "mrai_to_raw <sizeMrai>",
                    desc: "Multiply an Mrai amount by the Mrai ratio.",
                    handler: (argv) => {
                        returnPromise = nanoClient.mrai_to_raw(argv.sizeMrai);
                        messageType = "mrai_to_raw";
                    }
                })
                .command({
                    command: "krai_from_raw <sizeRaw>",
                    desc: "Divide a raw amount down by the krai ratio.",
                    handler: (argv) => {
                        returnPromise = nanoClient.krai_from_raw(argv.sizeRaw);
                        messageType = "krai_from_raw";

                    }
                })
                .command({
                    command: "krai_to_raw <sizeKrai>",
                    desc: "Multiply an krai amount by the krai ratio.",
                    handler: (argv) => {
                        returnPromise = nanoClient.krai_to_raw(argv.sizeKrai);
                        messageType = "krai_to_raw";
                    }
                })
                .command({
                    command: "rai_from_raw <sizeRaw>",
                    desc: "Divide a raw amount down by the rai ratio.",
                    handler: (argv) => {
                        returnPromise = nanoClient.rai_from_raw(argv.sizeRaw);
                        messageType = "rai_from_raw";

                    }
                })
                .command({
                    command: "rai_to_raw <sizeRai>",
                    desc: "Multiply an rai amount by the rai ratio.",
                    handle: (argv) => {
                        returnPromise = nanoClient.rai_to_raw(argv.sizeRai);
                        messageType = "rai_to_raw";
                    }
                })

                /*
                //currently disabled
                                .command({
                                    command: "ledger <accountAddress> [count] [representative] [weight] [pending] [sorting]",
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
                                        returnPromise = nanoClient.ledger(argv.accountAddress, argv.representative, argv.weight, argv.pending, argv.sorting);
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
                .alias('h', 'help')
                .parse(arguments, (_err, argv, output) => {
                    console.log(argv);
                    console.log(output)
                    if (output != "") {
                        output = output.split("\n").join("\r\n");
                        output += "\r\n";
                        resolve(output);
                    }


                });

            if (returnPromise == null) {
                reject("ERROR:Not a command");
            }
            else {
                returnPromise.then((message) => {
                    if (message != "") {
                        try{
                            console.log("---------------")
                            var messageJson   = NanoParseMessage(message,messageType);
                            var messageString =  JSON.stringify(messageJson, null, 4)
                            messageString = messageString.split("\n").join("\r\n");
                            messageString += "\r\n";
                            resolve(messageString);
                        }
                        catch(error){
                            console.log(error)
                            reject("ERROR: - " + message.toString());
                        }

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