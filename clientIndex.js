var Client = require('bittorrent-tracker')
var magnet = require('magnet-uri')
var wrtc = require('wrtc')
var magnetURIDefault = require('./mangnetURI.js');
const { EventEmitter } = require('events')
const debug = require('debug');

const logInfo = require('debug')('nanoClient:index:info');
const errorLog = require('debug')('nanoClient:index:error');


//need to manage multiple peer trying to conenct

// 
class NanoConnectBaseClient extends EventEmitter {
    constructor(magnetURI = magnetURIDefault, opts = {}) {
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
            errorLog("took longer then 5 seconds to connect.  Going to reset connectoin");
            this.btClient.destroy();
        }
        
        

        this.btClient = new Client(this.requiredOpts)

        this.btClient.on('error', function (err) {
            // fatal client error!
            errorLog(err.message)
            this.emit('error', err)
        })
        this.btClient.on('update', function (data) {
            logInfo('got an announce response from tracker: ' + data.announce)
            logInfo('number of seeders in the swarm: ' + data.complete)
            logInfo('number of leechers in the swarm: ' + data.incomplete)
        })
        this.btClient.start();
        this.btClient.update();
        this.btClient.once('peer', (peer) => { 
            
            

            peer.once('connect', () => {
                logInfo(peer._id + " peerConnected")
                this.emit('connected');
                this.peer = peer;


                peer.once('close',()=>{
                    logInfo(peer._id + " peerConnected")
                    if(this.peer != null)
                    {
                        this.peer.destroy();
                        this.peer = null;
                    } 
                });
    
                peer.once('error',(error)=>{
                    logError(error)
                    if(!peer._readableState.destroyed)
                    {
                        peer.destory();
                    }
                    this.peer = null;
                });
                
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
            this.on('connected',()=>{
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
            }, 6000);
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
                logInfo(data);
                return resolve(data);
            });

        });

    }
}

module.exports = NanoConnectBaseClient