const commands ={
    "account_balance":{
        paramNum: 1
    },
    "account_block_count":{
        paramNum: 1
    },
    "account_info":{
        paramNum: 4
    },
    "account_get":{
        paramNum: 1
    },
    "account_history":{
        paramNum: 2
    },
    "account_key":{
        paramNum: 1
    },
    "account_representative":{
        paramNum: 1
    },
    "account_weight":{
        paramNum: 1
    },
    "available_supply":{
        paramNum: 0
    },
    "block":{
        paramNum: 1
    },
    "blocks":{
        paramNum: 1
    },
    "blocks_info":{
        paramNum: 3
    },
    "block_account":{
        paramNum: 1
    },
    "block_count":{
        paramNum: 0
    },
    "block_count_type":{
        paramNum: 0
    },
    "chain":{
        paramNum: 2
    },
    "frontiers":{
        paramNum: 2
    },
    "frontiers_count":{
        paramNum: 0
    },
    "history":{
        paramNum: 2
    },
    "mrai_from_raw":{
        paramNum: 1
    },
    "mrai_to_raw":{
        paramNum: 1
    },
    "krai_from_raw":{
        paramNum: 1
    },
    "krai_to_raw":{
        paramNum: 1
    },
    "rai_from_raw":{
        paramNum: 1
    },
    "rai_to_raw":{
        paramNum: 1
    }
}



function checkValidRPCCommand (text)
{
    //could fail
    var data = JSON.parse(text.toString());
    
    if(data.hasOwnProperty("method") && data.hasOwnProperty("params") )
    {
        if(commands.hasOwnProperty(data.method))
        {
            if(commands[data.method].paramNum == Object.keys(data["params"]).length)
            {
                return data;
            }
            throw("Wrong number of params");
        }
        throw("Command is not valid or not supported");
    }
    throw("invalid structor of message - EX Valid {method:\"block_count\",params:{}}");
}

module.exports = checkValidRPCCommand;