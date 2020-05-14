var Client = require('bittorrent-tracker')
var magnet = require('magnet-uri')
var wrtc = require('wrtc')
const { EventEmitter } = require('events')





//need to manage multiple peer trying to conenct

// 
class NanoConnectBaseClient extends EventEmitter {
    constructor(magnetURI, opts = {}) {
        
        var parsedTorrent = magnet(magnetURI)

        var requiredOpts = {
            infoHash: parsedTorrent.infoHash, // hex string or Buffer
            peerId: Buffer.alloc(20, 'NanoClient__________'), // hex string or Buffer
            announce: parsedTorrent.announce
        }

        super()
        if (opts.wrtc != undefined) {
            requiredOpts.wrtc = opts.wrtc
        }
        if (opts.port != undefined) {
            requiredOpts.port = opts.port;
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

        this.peer = null;
    }

    connectedToServer() {
        return !(this.peer == null);
    }

    connect() {

        console.log("connecting ")
        console.log("start")
        this.btClient.start();
        return new Promise((resolve, reject) => {
            this.btClient.update();
            this.btClient.once('peer', (peer) => {
                peer.once('connect', () => {
                    console.log("connected up")
                    this.peer = peer;

                    this.peer.once('error', () => {
                        console.log("***************peer error");
                    });

                    return resolve();
                });

                peer.once('close',()=>{
                    console.log("-------------closed")
                    this.peer.destroy();
                    this.peer = null;
                });

                peer.once('error',(error)=>{
                    console.log(error)
                    console.log("------------------errror")
                });

                this.btClient.stop();

            })

        });
    }

    disconnect() {
        this.peer.destroy();
    }



    _send(method, params = {}) {
        return new Promise((resolve, reject) => {
            var sendingJsonMessage = {
                "method": method,
                "params": params
            }

            this.peer.send(JSON.stringify(sendingJsonMessage));
            this.peer.once('data', (data) => {
                console.log("connected up");
                return resolve(data);
            });

        });

    }
}

module.exports = NanoConnectBaseClient