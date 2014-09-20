// database init
var fs = require('fs');
var sqlite3 = require('sqlite3').verbose();
var db;

// opens the database at dbpath, or creates if it doesn’t exist
function open(dbpath) {
  // XXX: check if dbpath exists
  db = new sqlite3.Database(dbpath);
  //initdb();
  console.log("Database opened!");

  // we want foreign key constraints!
  db.run('PRAGMA foreign_keys = ON;');
}
exports.open = open;

function initdb(){
  // XXX: initdb.sql drops tables
  fs.readFile('initdb.sql', 'utf8', function (err, sql) {
    if (err) {
      throw err;
    }
    else {
      console.log(sql);
      // XXX: careful, sql prior to this callback are voided?
      db.exec(sql);
    }
  });

}

// add file to db
function addFile(path) {
  db.run("INSERT INTO paths VALUES (?)", path);
}
exports.addFile = addFile;

// remove all occurrences of path from the db (can remove multiple files)
// return: true if removed, false if none found
function removePath(path){
  db.run("DELETE FROM paths WHERE path LIKE (?)", path+'%');
}
exports.removePath = removePath;

// remove all occurrences of tagname from the db
function removeTagname() {
  // XXX
}
exports.removeTagname = removeTagname;



/**
open('taglite.db');
console.log(db);
console.log('Removing path: /path/to/');
removePath('/path/to/');
**/

//db.serialize(function () {
  //db.each("SELECT * FROM tag", function(err, row) {
    //console.log(row);
    //console.log(row.id, row.path, row.pos);
    //console.log(row.id + '\n' + row.path + '\n' + row.pos);
  //});
//});
