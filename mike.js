var fs       = require("fs");
var path     = require('path');
var db       = require('./db');
var S        = require('string');
var sql      = require("sqlite3");
var config   = require('./config');
var express  = require("express");
var walkSync = require('walk-sync');

var path = '.';
var isServer = true;

var paths = walkSync(path);

function findFilesWithExtention(dir, extentions) {
    var lst =[];

    for ( var i = 0; i < paths.length; i++) {
        for (var j = 0; j < extentions.length; j++) {
            if (S(paths[i]).endsWith(S(dir.concat(extentions[j])))) {
                lst.push(paths[i]);
            };
        };
    };

    return lst;
}

function setupExpress(io) {

    io.get('/', function(req, res){
        res.send(findFilesWithExtention('.', config.extentions));
    });

    io.on('search', function(socket){
        console.log('socket: ' + socket);
    });

    io.on('add-dirs', function(socket){
        console.log('socket: ' + socket);
    });

    io.on('add-files', function(socket){
        console.log('socket: ' + socket);
    });

    io.on('add-tag-names', function(socket){
        console.log('socket: ' + socket);
    });

    io.on('edit-tag-name', function(socket){
        console.log('socket: ' + socket);
    });

    io.on('delete-tag-names', function(socket){
    });

    io.on('untrack-dirs', function(socket){
        console.log('socket: ' + socket);
    });

    io.on('untrack-files', function(socket){
        console.log('socket: ' + socket);
    });

    io.on('update-file', function(socket){
        console.log('socket: ' + socket);
    });
}

db.open(config.dbname);


if (isServer) {

    var app = require('express')();
    var http = require('http').Server(app);

    setupExpress(app);

    http.listen(3000, function(){
        console.log('listening on *:3000');
    });
};