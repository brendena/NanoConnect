var Client = require('bittorrent-tracker')
var magnet = require('magnet-uri')
var wrtc = require('wrtc')
const { EventEmitter } = require('events')





//need to manage multiple peer trying to conenct

// 
class NanoConnectBaseClient extends EventEmitter {
    constructor(magnetURI, opts = {}) {
        super();


        var parsedTorrent = magnet(magnetURI)

        this.requiredOpts = {
            infoHash: parsedTorrent.infoHash, // hex string or Buffer
            peerId: Buffer.alloc(20, 'NanoClient__________'), // hex string or Buffer
            announce: parsedTorrent.announce
        }

        if (opts.wrtc != undefined) {
            this.requiredOpts.wrtc = opts.wrtc
        }
        if (opts.port != undefined) {
            this.requiredOpts.port = opts.port;
        }

        this.btClient = null;
        this.peer = null;
    }

    connectBTClient()
    {
        if(this.btClient != null)
        {
            this.btClient.destroy();
        }
        console.log("-----------------------desting my connection and trying again\n");
        

        this.btClient = new Client(this.requiredOpts)

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
        this.btClient.start();
        this.btClient.update();
        this.btClient.once('peer', (peer) => { 
            
            

            peer.once('connect', () => {
                console.log("connected up")
                this.emit('connected');
                this.peer = peer;

                this.peer.once('error', () => {
                    console.log("***************peer error ");
                });
            });

            peer.once('close',()=>{
                console.log("-------------closed")
                this.peer.destroy();
                this.peer = null;
            });

            peer.once('error',(error)=>{
                console.log(error)
                console.log("------------------errror")
                this.peer.destroy();
                this.peer = null;
            });

            this.btClient.stop();
        });
    }

    connectedToServer() {
        return !(this.peer == null);
    }

    waitForConnection() {
        return new Promise((resolve, reject) => {
            if(this.connectedToServer())
            {
                return resolve();
            }
            console.log(this)
            this.on('connected',()=>{
                console.log("-------------------------------got the emit\n");
                return resolve();
            });
        
        });
    }

    connect() {
        

        var loggingInLoop =  ()=>{
            this.connectBTClient();

            setTimeout(()=>{
                if(!this.connectedToServer()){
                    loggingInLoop();

                }
            }, 10000);
        }
        loggingInLoop();
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