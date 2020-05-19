
var path = require("path");
const webpack = require('webpack');

console.log(__dirname + '/dist')

module.exports = {
  entry: __dirname + "/ClientBrowser.js",
  output: {
    path: path.resolve('./dist'),
    filename: 'NanoConnectClient.js',
  },
  mode: "production",// development //production
  //devtool:"source-map",
	optimization: {
		minimize: false
	},
  module: {
    rules: [
        {
            test: /\.js?$/,
            exclude: /node_module/,
            use: 'babel-loader'
        }
      ]
  }
};