var fs       = require("fs");
var path     = require('path');
var db       = require('./db');
var S        = require('string');
var sql      = require("sqlite3");
var config   = require('./config');
var express  = require("express");
var walkSync = require('walk-sync');

var path = '.';
var isServer = false;

var paths = walkSync(path);

function findFilesWithExtention(dir, extentions) {
    var lst =[];

    for ( var i = 0; i < paths.length; i++) {
        for (var j = 0; j < extentions.length; j++) {
            if (S(paths[i]).endsWith(S(dir.concat(extentions[j])))) {
                lst.push(paths[i]);
            }
        }
    }

    return lst;
}

function setupExpress(io) {

    // io.get('/', function(req, res){
    //     res.send(findFilesWithExtention('.', config.extentions));
    // });

    io.on('search', function(socket){
        console.log('socket: ' + socket);
    });

    io.on('add-dirs', function(socket){
        console.log('socket: ' + socket);
    });

    io.on('add-files', function(socket){
        var files = socket.files;
        var tags  = socket.tagnames;
        var json = {};
        var rtn = false;

        for(var file in files) {
            rtn = db.addFile(file);
            if(!rtn) break;

            for(var tag in tags) {
                rtn = db.addTagToFile(file, tag);
                if(!rtn) break;
            }
        }

        json.success = rtn;
        socket.emit(json);
    });

    io.on('add-tag-names', function(socket){
        console.log('socket: ' + socket);
    });

    io.on('edit-tag-name', function(socket){
        var json = {};
        var orig = socket.original;
        var modi = socket.modified;
        var rtn = false;

        rtn = db.renameTag(orig, modi);

        json.success = rtn;
        socket.emit(json);
    });

    io.on('delete-tag-names', function(socket){
        var json = {};
        var lst = socket.tagnames;
        var rtn = false;

        for (var i = 0; i < lst.length; i++) {
            rtn = vardb.removePath(lst[i]);
            db.removeTagname(lst[i]);
            if(!rtn) {
                break;
            }
        }

        json.success = rtn;
        socket.emit(json);
    });

    io.on('untrack-dirs', function(socket){
        var json = {};
        var lst = socket.directories;
        var rtn = false;

        for (var i = 0; i < lst.length; i++) {
            rtn = db.removePath(lst[i]);
            if(!rtn) {
                break;
            }
        }

        json.success = rtn;
        socket.emit(json);
    });

    io.on('untrack-files', function(socket){
        var json = {};
        var lst = socket.files;
        var rtn = false;

        for (var i = 0; i < lst.length; i++) {
            rtn = db.removePath(lst[i]);
            if(!rtn) break;
        }

        json.success = rtn;
        socket.emit(json);
    });

    io.on('update-file', function(socket){
        console.log('socket: ' + socket);
    });
}
exports.setupExpress = setupExpress;

db.open(config.dbname);


if (isServer) {

    var app = require('express')();
    var http = require('http').Server(app);

    setupExpress(app);

    http.listen(3000, function(){
        console.log('listening on *:3000');
    });
}