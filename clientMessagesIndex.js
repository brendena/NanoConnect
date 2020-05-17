
var NanoConnectBase = require('./clientIndex')

class NanoConnectClient extends NanoConnectBase {
    constructor (opts = {}) {
        super(opts)
    }

    /**
     * Returns how many RAW is owned and how many have not yet been received by account.
     *
     * @param {string} account - The XRB account address.
     */
    account_balance(account) {
        return this._send("account_balance", {
        account
        });
    }

    /**
     * Get number of blocks for a specific account
     * @param {string} account - The XRB account address.
     */
    account_block_count(account) {
        return this._send("account_block_count", {
        account
        });
    }

    /**
     * Returns frontier, open block, change representative block, balance,
     * last modified timestamp from local database & block count for account
     * @param {string} account - The XRB account address.
     * @param {boolean} representative - Additionally returns representative for account (v8.1+)
     * @param {boolean} weight - Additionally returns voting weight for account (v8.1+)
     * @param {boolean} pending - Additionally returns pending balance for account (v8.1+)
     */
    account_info(
        account,
        representative = false,
        weight = false,
        pending = false
    ) {
        return this._send("account_info", {
        account,
        representative,
        weight,
        pending
        });
    }

    /**
     * Get account number for the public key
     * @param {string} key - An XRB public key.
     */
    account_get(key) {
        return this._send("account_get", {
        key
        });
    }

    /**
     * Reports send/receive information for a account
     * @param {string} account - The XRB account address.
     * @param {Number} count - Response length (default 1)
     */
    account_history(account, count = 1) {
        return this._send("account_history", {
        account,
        count
        });
    }

    /**
     * Get the public key for account
     * @param {string} account - AAn XRB account.
     */
    account_key(account) {
        return this._send("account_key", {
        account
        });
    }

    /**
     * Returns the representative for account
     * @param {string} account - The XRB account address.
     */
    account_representative(account) {
        return this._send("account_representative", {
        account
        });
    }

    /**
     * Returns the voting weight for account
     * @param {string} account - The XRB account address.
     */
    account_weight(account) {
        return this._send("account_weight", {
        account
        });
    }

    /**
     * Returns how many rai are in the public supply
     */
    available_supply() {
        return this._send("available_supply");
    }

    /**
     * Retrieves a json representation of block
     * @param {string} hash - A block hash.
     */
    block(hash) {
        return this._send("block", {
        hash
        });
    }

    /**
     * Retrieves a json representations of blocks
     * @param {Array<string>} hashes - A list of block hashes.
     */
    blocks(hashes) {
        return this._send("blocks", {
        hashes
        });
    }

    /**
     * Retrieves a json representations of blocks with transaction amount & block account
     * @param {Array<string>} hashes - A list of block hashes.
     */
    blocks_info(hashes, source = false, pending = false) {
        return this._send("blocks_info", {
        hashes,
        source,
        pending
        });
    }

    /**
     * Returns the account containing block
     * @param {string} hash - A block hash.
     */
    block_account(hash) {
        return this._send("block_account", {
        hash
        });
    }

    /**
     * Reports the number of blocks in the ledger and unchecked synchronizing blocks
     */
    block_count() {
        return this._send("block_count");
    }

    /**
     * Reports the number of blocks in the ledger by type (send, receive, open, change)
     */
    block_count_type() {
        return this._send("block_count_type");
    }

    /**
     * Returns a list of block hashes in the account chain starting at block up to count
     * @param {string} block - A block hash.
     * @param {Number} count - Max count of items to return.
     */
    chain(block, count = 1) {
        return this._send("chain", {
        block,
        count
        });
    }

    /**
     * Returns a list of pairs of account and block hash representing the head block starting at account up to count
     * @param {string} account - The XRB account address.
     * @param {Number} count - How much items to get from the list. (defaults to 1)
     */
    frontiers(account, count = 1) {
        return this._send("frontiers", {
        account,
        count
        });
    }

    /**
     * Reports the number of accounts in the ledger
     */
    frontiers_count() {
        return this._send("frontiers_count");
    }

    /**
     * Reports send/receive information for a chain of blocks
     * @param {string} hash - A block hash.
     * @param {Number} count - How much items to get from the list. (defaults to 1)
     */
    history(hash, count = 1) {
        return this._send("history", {
        hash,
        count
        });
    }

    /**
     * Divide a raw amount down by the Mrai ratio.
     * @param {string} amount - An amount to be converted.
     */
    mrai_from_raw(amount) {
        return this._send("mrai_from_raw", {
        amount
        });
    }

    /**
     * Multiply an Mrai amount by the Mrai ratio.
     * @param {string} amount - An amount to be converted.
     */
    mrai_to_raw(amount) {
        return this._send("mrai_to_raw", {
        amount
        });
    }

    /**
     * Divide a raw amount down by the krai ratio.
     * @param {string} amount - An amount to be converted.
     */
    krai_from_raw(amount) {
        return this._send("krai_from_raw", {
        amount
        });
    }

    /**
     * Multiply an krai amount by the krai ratio.
     * @param {string} amount - An amount to be converted.
     */
    krai_to_raw(amount) {
        return this._send("krai_to_raw", {
        amount
        });
    }

    /**
     * Divide a raw amount down by the rai ratio.
     * @param {string} amount - An amount to be converted.
     */
    rai_from_raw(amount) {
        return this._send("rai_from_raw", {
        amount
        });
    }

    /**
     * Multiply an rai amount by the rai ratio.
     * @param {string} amount - An amount to be converted.
     */
    rai_to_raw(amount) {
        return this._send("rai_to_raw", {
        amount
        });
    }

    /**
     * Returns frontier, open block, change representative block, balance,
     * last modified timestamp from local database & block count starting at account up to count
     * @enable_control required, version 8.1+
     *
     * @param {string} account - The XRB account address.
     * @param {Number} count - Defines from where results are returned.
     * @param {boolean} representative - Additionally returns representative for each account.
     * @param {boolean} weight - Additionally returns voting weight for each account.
     * @param {boolean} pending - Additionally returns pending balance for each account.
     * @param {boolean} sorting - Sort the results by DESC.
     */
    ledger(
        account,
        count = 1,
        representative = false,
        weight = false,
        pending = false,
        sorting = false
    ) {
        return this._send("ledger", {
        account,
        count,
        representative,
        weight,
        pending,
        sorting
        });
    }

    /**
     * Creates a json representations of new block based on input data & signed with private key or account in wallet
     * @enable_control required, version 8.1+
     *
     * @param {string} type - The block type.
     * @param {string} key - The block signing key.
     * @param {string} account - An XRB account.
     * @param {string} representative - An XRB representative account.
     * @param {string} source - A block source.
     */
    block_create(type, key, account, representative, source) {
        return this._send("block_create", {
        type,
        key,
        account,
        representative,
        source
        });
    }

    /**
     * Publish block to the network.
     * @param {Object} block - A block to process. Format:
     * https://github.com/clemahieu/raiblocks/wiki/RPC-protocol#process-block
     */
    process(block) {
        return this._send("process", {
        block
        });
    }

    /**
     * Returns a list of pairs of representative and its voting weight
     * @param {Number} count - Count of items to return. (Defaults to 1)
     * @param {boolean} sorting - Sort the returned results by DESC.
     */
    representatives(count = 1, sorting = false) {
        return this._send("representatives");
    }
}

module.exports = NanoConnectClient