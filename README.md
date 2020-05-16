# start own bittorent-tracker 
~~~bash
bittorrent-tracker
# ws://localhost:8000
~~~



### Logs
Turn on with node logging with DEBUG=NSindexInfo,NSindexError node ./examples/serverExample.js
* NSIndexInfo #stands for NanoClientIndexInfo
* NSIndexError
* NSindexInfo  
* NSindexError



### Getting a node started
```bash
#main totorial
#https://docs.nano.org/running-a-node/node-setup/

#First you have to get nano docker container
docker pull nanocurrency/nano

#Then run the network
docker run --restart=unless-stopped -d \
  -p 7075:7075/udp \
  -p 7075:7075 \
  -p [::1]:7076:7076 \
  -p [::1]:7078:7078 \
  -v ${NANO_HOST_FOLDER}:/root \ #This folder will hold a VM's data
  --name nano_server \
  nanocurrency/nano:latest 

#Then your going to have to wait for the server to fully bootstrap itself.

```