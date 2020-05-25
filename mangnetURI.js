//old hash address
//module.exports = "magnet:?xt=urn:btih:dd59ca795c689b00713f9f2bb15379b32bb13cbc&tr=ws://localhost:8000"
//module.exports =  "magnet:?xt=urn:btih:dd59ca795c689b00713f9f2bb15379b32bb13cbc&tr=wss%3A%2F%2Ftracker.btorrent.xyz"

/*
I don't know why this magnet link works because the hash is a 40 hex character string (SHA 1).  So '_' shouldn't be a accessible.
But it does work and i think it make it a lot easier to read and remember.  Might need to change this for compatibility reason
later down the road.
*/


var numberMagnetLinks = 4;
var listOfLinks = []

for(var i =0; i < numberMagnetLinks; i++)
{
    //listOfLinks.push("magnet:?xt=urn:btih:NanoV20_ReleaseNode_"+ i + "___________&tr=wss%3A%2F%2Ftracker.btorrent.xyz");
    listOfLinks.push("magnet:?xt=urn:btih:"+ String(i).repeat(40) + "&tr=wss%3A%2F%2Ftracker.btorrent.xyz");
}


module.exports =  listOfLinks;
