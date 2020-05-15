
const http = require("http");
class NanoRPCHandler {

    constructor(options) {

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
        } 
        catch (e) {
            throw new Error(e);
        }
    }

    send(method, params = undefined) {
        return new Promise((resolve, reject) => {
          var req = {};
          try {
            req = this._buildRPCReq(method, params);
          } catch (err) {
            return reject(err);
          }
    
          // Take HTTPS urls in consideration.
          
          const lib = http;
          const requestOptions = {
            hostname: "0:0:0:0:0:0:0:1",
            port: 7076,
            method: "POST",
            path: "/",
            headers: this.headers
          };
          const request = lib.request(requestOptions, response => {
            if (response.statusCode < 200 || response.statusCode > 299) {
              reject(
                new Error(
                  "Failed to fetch URL. Status code: " + response.statusCode
                )
              );
            }
    
            const body = [];
    
            response.on("data", chunk => {
              body.push(chunk);
            });
    
            response.on("end", () => {
              const data = body.join("");
    
              try {
                //console.log(data);
                return resolve(data); 
              } catch (e) {
                reject(e);
              }
            });
          });
    
          request.on("error", e => {
            reject(e);
          });
    
          request.write(req.body);
          request.end();
        });
      }
}



module.exports = NanoRPCHandler