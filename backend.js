var fs       = require("fs");
var path     = require('path');
var db       = require('./db');
var S        = require('string');
var sql      = require("sqlite3");
var config   = require('./config');
var walkSync = require('walk-sync');

var path = '.';

var paths = walkSync(path);

function findFilesWithExtention(dir, extentions) {
    "use strict";
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

function setupIPC(io) {
    "use strict";

    // io.get('/', function(req, res){
    //     res.send(findFilesWithExtention('.', config.extentions));
    // });

    io.on('search', function(event, arg) {
        console.log('socket: ' + socket);
    });

    io.on('add-dirs', function(event, arg) {
        var dirs = arg.directories;
        var tags = arg.tagnames;
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
        event.sender.send(json);
    });

    io.on('add-files', function(event, arg) {
        var files = arg.files;
        var tags  = arg.tagnames;
        var json = {};
        var rtn = false;

        for(var i in files) {
            if(fileOK(files[i])) {
                rtn = db.addFile(files[i]);
                if(!rtn) break;
            } else {
                console.log("File does not exist: " + files[i]);
            }

            for(var j in tags) {
                rtn = db.addTagToFile(file, tags[j]);
                if(!rtn) break;
            }
        }

        json.success = rtn;
        event.sender.send(json);
    });

    io.on('add-tag-names', function(event, arg) {
        var tags = arg.tagnames;
        var rtn = false;
        var json = {};

        for(var i in tags) {
            rtn = db.addTagname(tags[i]);
            if(!rtn) break;
        }

        json.success = rtn;
        event.sender.send(json);
    });

    io.on('edit-tag-name', function(event, arg) {
        var json = {};
        var orig = arg.original;
        var modi = arg.modified;
        var rtn = false;

        rtn = db.renameTag(orig, modi);

        json.success = rtn;
        event.sender.send(json);
    });

    io.on('delete-tag-names', function(event, arg) {
        var json = {};
        var lst = arg.tagnames;
        var rtn = false;

        for (var i = 0; i < lst.length; i++) {
            rtn = vardb.removePath(lst[i]);
            db.removeTagname(lst[i]);
            if(!rtn) break;
        }

        json.success = rtn;
        event.sender.send(json);
    });

    io.on('untrack-dirs', function(event, arg) {
        var json = {};
        var lst = arg.directories;
        var rtn = false;

        for (var i = 0; i < lst.length; i++) {
            rtn = db.removePath(lst[i]);
            if(!rtn) break;
        }

        json.success = rtn;
        event.sender.send(json);
    });

    io.on('untrack-files', function(event, arg) {
        var json = {};
        var lst = arg.files;
        var rtn = false;

        for (var i = 0; i < lst.length; i++) {
            rtn = db.removePath(lst[i]);
            if(!rtn) break;
        }

        json.success = rtn;
        event.sender.send(json);
    });

    io.on('update-file', function(event, arg) {
        console.log('socket: ' + socket);
    });
}
exports.setupIPC = setupIPC;

db.open(config.dbname);