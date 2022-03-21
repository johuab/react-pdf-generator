/*
 * Copyright (c) 2022, JOHU AB
 */

const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');

const PORT = 8888;

// Handle dynamic hosts
const HOST_PREFIX = '--host';
const hostArg = process.argv.find((arg) => arg.startsWith(HOST_PREFIX));
const host = hostArg ? hostArg.split('=')[1].trim() : "localhost";

// Load webpack config
const config = require('./webpack.config')();

new WebpackDevServer(webpack(config), {
  hot: false, // Turn off hmr
  historyApiFallback: true,
}).listen(PORT, host, function resultCb(listenErr) {
  if (listenErr) {
    console.error(listenErr);
  }
  console.log(`Listening at ${host}:${PORT}`);
});
