

var loopThroughKeys = function (loopingKeyObject, cb) {
    for (const key of Object.keys(loopingKeyObject)) {
        loopingKeyObject[key] = cb(loopingKeyObject[key]);
    }
}


var parseNanoMessage = function (messageBuffer, messageType) {
    var message = JSON.parse(messageBuffer.toString());
    console.log("got here")
    if (messageType == "account_balance") {
        message["balance"] = parseInt(message["balance"]);
        message["pending"] = parseInt(message["pending"]);
    }
    else if (messageType == "account_block_count") {
        message["block_count"] = parseInt(message["block_count"]);
    }
    else if (messageType == "account_history") {
        console.log(message["history"]);
        message["history"].forEach(function (historyItem) {
            historyItem["amount"] = parseInt(message["amount"]);
            return historyItem;
        });
    }
    else if (messageType == "account_weight") {
        message["weight"] = parseInt(message["weight"]);
    }
    else if (messageType == "available_supply") {
        message["available_supply"] = parseInt(message["available_supply"]);
    }
    else if (messageType == "block") {
        message["amount"] = parseInt(message["amount"]);
        message["balance"] = parseInt(message["balance"]);
        message["available_supply"] = parseInt(message["available_supply"]);
        message["contents"] = JSON.parse(message["contents"]);
    }
    else if (messageType == "blocks") {
        loopThroughKeys(message.blocks, function (item) {
            let jsonItem = JSON.parse(item);
            jsonItem["balance"] = parseInt(jsonItem["balance"])
            return jsonItem;
        });
    }
    else if (messageType == "block_count") {
        message["count"] = parseInt(message["count"]);
        message["unchecked"] = parseInt(message["unchecked"]);
        message["cemented"] = parseInt(message["cemented"]);
    }
    else if (messageType == "block_count_type") {
        message["send"] = parseInt(message["send"]);
        message["receive"] = parseInt(message["receive"]);
        message["open"] = parseInt(message["open"]);
        message["change"] = parseInt(message["change"]);
        message["state"] = parseInt(message["state"]);
    }
    else if (
        messageType == "mrai_from_raw" ||
        messageType == "mrai_to_raw" ||
        messageType == "krai_from_raw" ||
        messageType == "krai_to_raw" ||
        messageType == "rai_from_raw" ||
        messageType == "rai_to_raw") 
    {
    
        message["amount"] = parseInt(message["amount"]);
    }
    console.log(JSON.stringify(message, null, 4));

    return message;
}



module.exports = parseNanoMessage;