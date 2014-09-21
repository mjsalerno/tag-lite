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


// tagnames ==> paths
function search(tagname, callback) {
  var paths = [];
  db.each("SELECT p.path FROM paths p, tags t, tagnames tn WHERE p.pathid=t.pathid AND t.tagid=tn.tagid AND tn.name=(?)", tagname, callback);
}
exports.search = search;

// add file to db
function addFile(path) {
  db.run("INSERT INTO paths VALUES (null, (?))", path, function (err) {
    if (err !== null) {
      console.log(err);
      return;
    }
    console.log("INSERT: "+this.lastID);
  });
}
exports.addFile = addFile;

// remove all occurrences of path from the db (can remove multiple files)
// return: true if removed, false if none found or error
function removePath(path) {
  db.run("DELETE FROM paths WHERE path LIKE (?)", path+'%', function (err) {
    if (err !== null) {
      console.log(err);
      return;
    }
    console.log("DELETE: "+this.changes);
  });
}
exports.removePath = removePath;

// add tagname 
function addTagname(tagname) {
  db.run("INSERT INTO tagnames VALUES (null,(?))", tagname, function (err) {
    if (err !== null) {
      console.log(err);
      return;
    }
    console.log("INSERT: "+this.changes);
  });
}
exports.addTagname = addTagname;

// remove all occurrences of tagname from the db
function removeTagname(tagname) {
  db.run("DELETE FROM tagnames WHERE name LIKE (?)", tagname, function (err) {
    if (err !== null) {
      console.log(err);
      return;
    }
    console.log("DELETE: "+this.changes);
  });
}
exports.removeTagname = removeTagname;

// rename orig to modified
function renameTag(orig, modified) {
  db.run("UPDATE tagnames SET name=(?) WHERE name LIKE (?)", modified, orig, function (err) {
    if (err !== null) {
      console.log(err);
      return;
    }
    console.log("UPDATE: "+this.changes);
  });
}
exports.renameTag = renameTag;

// tagnames must exist in the db already!!!!
function updateFile(path, tagnames, caption) {
  //removePath(path);
  var pathid;
  var captionid;
  db.serialize();
  db.get("SELECT pathid FROM paths WHERE path LIKE (?)", path, function (err, row) {
    if (err !== null) {
      console.log(err)
      return;
    }
    pathid = row.tagid;
    console.log("pathid: "+pathid);
    db.run("DELETE FROM tags WHERE pathid=(?)", pathid);
    db.run("INSERT INTO captions VALUES (null, (?))", caption, function (err) {
      if (err !== null) {
        console.log(err);
        return;
      }
      console.log("INSERT CAPTION: "+this.lastID);
      captionid = this.lastID;
      for (var i = tagnames.length - 1; i >= 0; i--) {
        db.get("SELECT tagid FROM tagnames WHERE name LIKE (?)", tagnames[i], function (err, row) {
          if (err !== null) {
            console.log(err)
            return;
          }
          // XXX: tagnames must be in tagnames already
          db.run("INSERT INTO tags VALUES ($tagid, $path, $pos, $captionid)", {
            $tagid: row.tagid,
            $path: pathid,
            $pos: null,
            $captionid: captionid
          }, function (err) {
            if (err !== null) {
            console.log(err);
            return;
            }
          });
        });
      };
    });
  });
}
exports.updateFile = updateFile;


//db.serialize(function () {
  //db.each("SELECT * FROM tag", function(err, row) {
    //console.log(row);
    //console.log(row.id, row.path, row.pos);
    //console.log(row.id + '\n' + row.path + '\n' + row.pos);
  //});
//});
