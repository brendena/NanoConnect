var Client = require('bittorrent-tracker')
var magnet = require('magnet-uri')
const BJSON = require('buffer-json')
var wrtc = require('wrtc')
var magnetURIDefault = require('./mangnetURI.js');
var NanoRPCHandler = require('./NanoRPCHandler');
const { EventEmitter } = require('events')
var Consts = require('./Consts.js');

const infoLog = require('debug')('NSindexInfo');
const errorLog = require('debug')('NSindexError');

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
    constructor (magnetURI = magnetURIDefault, opts = {}) {
        super()

        var parsedTorrent = magnet(magnetURI)

        var requiredOpts = {
            getAnnounceOpts: function () {
                // Provide a callback that will be called whenever announce() is called
                // internally (on timer), or by the user
                return {
                    uploaded: 10,
                    downloaded: 0,
                    left: 0,
                    numwant: 0  //since your not downloading anything keep this number low, else it will spawn a lot of sockets that will keep dying
                }
            },
            infoHash: parsedTorrent.infoHash, // hex string or Buffer
            peerId:   Buffer.alloc(20, generateRandomID()), // hex string or Buffer
            announce: parsedTorrent.announce,
            port: 6881, // torrent client port, (in browser, optional)
            wrtc: wrtc
          }


        this.btClient = new Client(requiredOpts)

        this.btClient.on('error', (err)=> {
            // fatal client error!
            errorLog('BT error - ' + err.message)
            //this.emit('error', err)
        })

        this.btClient.on('warning', (err)=> {
            // fatal client error!
            errorLog('BT warning - ' + err.message)
            //this.emit('error', err)
        })
        this.btClient.on('update', (data)=> {


            infoLog('got an announce response from tracker: ' + data.announce)
            infoLog('number of seeders in the swarm: ' + data.complete)
            infoLog('number of leechers in the swarm: ' + data.incomplete)
        })

        this.rpcHandler = new NanoRPCHandler();
    }

    _connectTrackingServer(cb)
    {
        this.btClient.start();
        this.btClient.on('peer', (peer)=> {
            
            infoLog("connected - " + peer._id );
            peer.once('connect', ()=>{
                cb(peer);
            });
        })

        //make sure that the server know's that you've completed the torrent
        var updateTracker = ()=>{
            this.btClient.update({
                uploaded: 1,
                left: 0,
              })

            setTimeout(()=>{
                updateTracker();
            },1000 * 60); //1 every minute
        }
        updateTracker();
        setTimeout(()=>{
            this.btClient.complete();
            this.btClient.update({
                uploaded: 1,
                left: 0,
              })
        },20000)
    }

    onData(data)
    {
        //infoLog("Received - " + data.toString());
        if(data.toString() === Consts.ServerMessage)
        {
            this.peer.destroy();
        }
        else
        {
            var data = JSON.parse(data.toString());
            this.self.rpcHandler.send(data.method, data.params).then((returnData)=>{
                //infoLog("Sent - " + returnData.toString());
                this.peer.send(returnData.toString());
            });
        }
    
    }


    startClientEvent()
    {
        this._connectTrackingServer((peer)=>{
            infoLog("connected Server");
            
            peer.send(Consts.ServerMessage);

            peer.once('error', (error)=>{

                try{
                    errorLog(error);
                    if(!peer._readableState.destroyed)
                    {
                        //peer.destory();
                    }
                    //peer.removeListener('data',this.onData);
                }
                catch(e)
                {
                    errorLog("---------failed at cleaning up peer");
                    errorLog(e);
                }
            });
            peer.on("data",this.onData.bind({self:this,peer:peer}));
        });
    }
}

module.exports = NanoConnectServer