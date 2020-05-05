

var Client = require('bittorrent-tracker')
var magnet = require('magnet-uri')
var wrtc = require('wrtc')
const { EventEmitter } = require('events')

var magnetURI =  "magnet:?xt=urn:btih:dd59ca795c689b00713f9f2bb15379b32bb13cbc&dn=DataSheBlow.png&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com"


var parsedTorrent = magnet(magnetURI)

var requiredOpts = {
    infoHash: parsedTorrent.infoHash, // hex string or Buffer
    peerId:   Buffer.alloc(20, 'NanoClientID________'), // hex string or Buffer
    announce: parsedTorrent.announce,
  }

//need to manage multiple peer trying to conenct

// 
class NanoConnectClient extends EventEmitter {
    constructor (opts = {}) {
        super()
        this.client = new Client(requiredOpts)

        this.client.on('error', function (err) {
            // fatal client error!
            console.log(err.message)
            this.emit('error', err)
        })
        this.client.on('update', function (data) {
            console.log('got an announce response from tracker: ' + data.announce)
            console.log('number of seeders in the swarm: ' + data.complete)
            console.log('number of leechers in the swarm: ' + data.incomplete)
        })

        this.peer = null;
    }

    _connectTrackingServer(cb)
    {
        this.client.start();
        this.client.once('peer', (peer)=> {
            console.log("testing this");
            console.log('-------------------found a peer: ' + peer) 

            peer.once('connect', ()=>{
                console.log("connected up")
                this.peer = peer;
                cb();

            });
        })
    }

    startClientTransactions()
    {
        this._connectTrackingServer(()=>{console.log("connected client")});
    }

    sendTransaction(jsonMessage)
    {
        return new Promise((resolve, reject) => {
            console.log("sending a message");
            this.peer.send(jsonMessage);
            
            this.peer.once("data", data=>{
                resolve(data);
            });
        });
    }

    sendMessage(jsonMessage)
    {
        this.peer.send(jsonMessage);
    }

    startClientEvent()
    {
        this._connectTrackingServer(()=>{
            console.log("connected Server");
            console.log(this.peer)
            this.peer.on("data", data=>{
                console.log("*************************received data " + data);
                this.emit('data', data)
            });
        });
    }
}

module.exports = NanoConnect