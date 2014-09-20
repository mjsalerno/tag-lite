var fs       = require("fs");
var path     = require('path');
var S        = require('string');
var db       = require('./db.js');
var sql      = require("sqlite3");
var config   = require('./config');
var express  = require("express");
var walkSync = require('walk-sync');

var path = '.';
var isServer = true;

var paths = walkSync(path);

for ( var i = 0; i < paths.length; i++) {
    for (var j = 0; j < config.extentions.length; j++) {
        if (S(paths[i]).endsWith(S('.'.concat(config.extentions[j])))) {
            console.log(paths[i]);
        };
    };
};