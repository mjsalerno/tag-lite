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

function initdb() {
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
  db.run("INSERT INTO paths VALUES (?)", path, function (err) {
    if (err !== null) {
      console.log(err);
    }
    else {
      console.log("INSERT: "+this.lastID);
    }
  });
}
exports.addFile = addFile;

// remove all occurrences of path from the db (can remove multiple files)
// return: true if removed, false if none found or error
function removePath(path) {
  db.run("DELETE FROM paths WHERE path LIKE (?)", path+'%', function (err) {
    if (err !== null) {
      console.log(err);
    }
    else {
      console.log("DELETE: "+this.changes);
    }
  });
}
exports.removePath = removePath;

// add tagname 
function addTagnames(tagname) {
  db.run("INSERT INTO tagnames VALUES (null,(?))", tagname, function (err) {
    if (err !== null) {
      console.log(err);
    }
    else {
      console.log("INSERT: "+this.changes);
    }
  });
}
exports.addTagnames = addTagnames;

// remove all occurrences of tagname from the db
function removeTagname(tagname) {
  db.run("DELETE FROM tagnames WHERE name LIKE (?)", tagname, function (err) {
    if (err !== null) {
      console.log(err);
    }
    else {
      console.log("DELETE: "+this.changes);
    }
  });
}
exports.removeTagname = removeTagname;

// rename orig to modified
function renameTag(orig, modified) {
  db.run("UPDATE tagnames SET name=(?) WHERE name LIKE (?)", modified, orig, function (err) {
    if (err !== null) {
      console.log(err);
    }
    else {
      console.log("UPDATE: "+this.changes);
    }
  });
}
exports.renameTag = renameTag;

//db.serialize(function () {
  //db.each("SELECT * FROM tag", function(err, row) {
    //console.log(row);
    //console.log(row.id, row.path, row.pos);
    //console.log(row.id + '\n' + row.path + '\n' + row.pos);
  //});
//});
