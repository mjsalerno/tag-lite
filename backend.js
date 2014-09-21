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

function fileOK(path, extentions) {
    "use strict";

    var ok = true;
    ok &= fs.existsSync(files[i]);

    for (var i = 0; i < extentions.length; i++) {
        ok &= S(path).endsWith(S(extentions[i]));
    }

    return ok;
}

function setupExpress(io) {

    // io.get('/', function(req, res){
    //     res.send(findFilesWithExtention('.', config.extentions));
    // });

    io.on('search', function(socket){
        console.log('socket: ' + socket);
    });

    io.on('add-dirs', function(socket){
        var dirs = socket.directories;
        var tags = socket.tagnames;
        var files = [];
        var json = {};
        var rtn = false;
        var results = [];

        for(var i in dirs) {
            files.concat(findFilesWithExtention(dir[i], config.extentions));
        }

        for(i in files) {
            var tmp = {};

            for(var j in tags) {
                rtn = db.addTagToFile(files[i], tags[j]);
                if(!rtn) break;
            }
            if(!rtn) break;

            tmp.files[i] = tags;
            results.push(tmp);
        }

        json.results = results;
        json.success = rtn;
        socket.emit(json);
    });

    io.on('add-files', function(socket){
        var files = socket.files;
        var tags  = socket.tagnames;
        var json = {};
        var rtn = false;

        for(var i in files) {
            rtn = db.addFile(files[i]);
            if(!rtn) break;

            for(var j in tags) {
                rtn = db.addTagToFile(file, tags[j]);
                if(!rtn) break;
            }
        }

        json.success = rtn;
        socket.emit(json);
    });

    io.on('add-tag-names', function(socket){
        var tags = socket.tagnames;
        var rtn = false;
        var json = {};

        for(var i in tags) {
            rtn = db.addTagname(tags[i]);
            if(!rtn) break;
        }

        json.success = rtn;
        socket.emit(json);
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
            if(!rtn) break;
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
            if(!rtn) break;
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