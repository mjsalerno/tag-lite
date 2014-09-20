var express = require("express");
var path = require('path');
var sql = require("sqlite3");
var fs = require("fs");
var S = require('string');

var walkSync = require('walk-sync');
var paths = walkSync('.');

for ( var i = 0; i < paths.length; i++) {
  if (S(paths[i]).endsWith(".txt")) {
    console.log(paths[i])
  };
};