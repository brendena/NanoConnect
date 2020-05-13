var Client = require('bittorrent-tracker')
var magnet = require('magnet-uri')
const BJSON = require('buffer-json')
var wrtc = require('wrtc')
var NanoRPCHandler = require('./NanoRPCHandler');

const { EventEmitter } = require('events')

var generateRandomID = function()
{
    //this make a random string of 11
    var randomString = Math.random().toString(36).substring(2, 15);
    //so double it and only take the first 20 characters
    return (randomString + randomString).substring(0, 20);
}



//need to manage multiple peer trying to conenct

// 
class NanoConnectServer extends EventEmitter {
    constructor (magnetURI, opts = {}) {
        super()

        var parsedTorrent = magnet(magnetURI)

        var requiredOpts = {
            infoHash: parsedTorrent.infoHash, // hex string or Buffer
            peerId:   Buffer.alloc(20, generateRandomID()), // hex string or Buffer
            announce: parsedTorrent.announce,
            port: 6881, // torrent client port, (in browser, optional)
            wrtc: wrtc
          }


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

        this.rpcHandler = new NanoRPCHandler();
    }

    _connectTrackingServer(cb)
    {
        this.btClient.start();
        this.btClient.on('peer', (peer)=> {
            console.log('-------------------found a peer: ') 
            console.log(peer._id)
            peer.once('connect', ()=>{
                //connected up

                cb(peer);
            });
        })
    }


    startClientEvent()
    {
        this._connectTrackingServer((peer)=>{
            console.log("connected Server");
            peer.once('error', (error)=>{
                console.log(error);
            });
            peer.on("data",async data=>{
                console.log(peer._id)
                //do validation on data
                console.log("*************************received data " + data);
                //send out a message to the server
                console.log(data.toString())
                var data = JSON.parse(data.toString());
                var returnData  = await this.rpcHandler.send(data.method, data.params)
                //then respond by sending back the data
                console.log(returnData)
                peer.send(returnData.toString());
               
            });
        });
    }
}

module.exports = NanoConnectServer