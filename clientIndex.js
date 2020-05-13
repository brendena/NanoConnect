

var Client = require('bittorrent-tracker')
var magnet = require('magnet-uri')
var wrtc = require('wrtc')
const { EventEmitter } = require('events')

//var magnetURI =  "magnet:?xt=urn:btih:dd59ca795c689b00713f9f2bb15379b32bb13cbc&dn=DataSheBlow.png&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com"
var magnetURI =  "magnet:?xt=urn:btih:dd59ca795c689b00713f9f2bb15379b32bb13cbc&dn=DataSheBlow.png&tr=ws://localhost:8000"


var parsedTorrent = magnet(magnetURI)

var requiredOpts = {
    infoHash: parsedTorrent.infoHash, // hex string or Buffer
    peerId:   Buffer.alloc(20, 'NanoClient__________'), // hex string or Buffer
    announce: parsedTorrent.announce,
    port: 6881, // torrent client port, (in browser, optional)
    wrtc: wrtc
  }

//need to manage multiple peer trying to conenct

// 
class NanoConnectBaseClient extends EventEmitter {
    constructor (opts = {}) {
        super()
        this.btClient = new Client(requiredOpts)

        this.btClient.on('error', function (err) {
            // fatal client error!
            console.log(err.message)
            this.emit('error', err)
        })
        this.btClient.on('update', function (data) {
            console.log('got an announce response from tracker: ' + data.announce)
            console.log('number of seeders in the swarm: ' + data.complete)
            console.log('number of leechers in the swarm: ' + data.incomplete)
        })

        this.peer = null;
    }

    connect()
    {
        console.log("connecting ")
        console.log("start")
        this.btClient.start();
        return new Promise((resolve, reject) => {
            this.btClient.update();
            this.btClient.once('peer', (peer)=> {
                peer.once('connect', ()=>{
                    console.log("connected up")
                    this.peer = peer;

                    this.peer.once('error', ()=>{
                        console.log("***************peer error");
                    });

                    return resolve();
                });
                this.btClient.stop();
                
            })
           
        });
    }

    disconnect()
    {
        this.peer.destroy();
    }

    /**
     * @function _buildRPCReq
     * @private
     * @description Create an RPC request object to be later used by `#_send`.
     * @param {string} action - A given RPC action.
     * @param {Object|Array} params - Parameters to be passed to the RPC daemon
     * @return {Object} Returns an object containing the request (url, body).
     */
    _buildRPCReq(action, params) {
        const req = {};
        const payload = null;

        req.url = this.nodeAddress;

        try {
            if (typeof params === "undefined") {
                req.body = JSON.stringify({
                action: action
                });
            } else {
                req.body = JSON.stringify({
                action: action,
                ...params
                });
            }
            return req;
        } catch (e) {
            throw new Error(e);
        }
    }


    _send(method, params = {})
    {
        return new Promise((resolve, reject) => {
            var sendingJsonMessage = {
                "method": method,
                "params": params
            }
    
            this.peer.send(JSON.stringify(sendingJsonMessage));
            this.peer.once('data', (data)=>{
                console.log("connected up");
                return resolve(data);
            });
            
        });

    }
}

module.exports = NanoConnectBaseClient