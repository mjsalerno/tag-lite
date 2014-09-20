var express = require("express");
var path = require('path');
var sql = require("sqlite3");
var fs = require("fs");
var backend = require("./backend");

/* Config imports */
var config = require('./config');

/* Create the web app */
var app = express(),
	server = require('http').createServer(app),
	io = require('socket.io').listen(server);

/* Set the directory where static content lives (aka root directory) */
app.use(express.static(path.join(__dirname, config.root)));

/* Start the server */
server.listen(config.port);

/* Log the port node is running on */
console.log('http://localhost:' + config.port);

/* Load the index page */
app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

/* Setup socket connection */
io.on('connection', function (socket) {
	backend.setupExpress(socket);
});
