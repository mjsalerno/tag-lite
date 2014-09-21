// database init
var fs = require('fs');
var sqlite3 = require('sqlite3').verbose();
var db;

function close() {
  db.close(function(err) {
    console.log(err);
  });
}
exports.close = close;

// opens the database at dbpath, or creates if it doesn’t exist
function open(dbpath) {
  if(fs.existsSync(dbpath)){
    db = new sqlite3.Database(dbpath, sqlite3.OPEN_READWRITE, function (err) {
      if (err !== null) {
        console.log("ERR:"+dbpath+" exists but could not open.");
        return;
      }
      console.log("Database "+dbpath+" opened!");
      // serialize, we don't need concurrecy here.
      db.serialize();
      // we want foreign key constraints!
      db.run('PRAGMA foreign_keys = ON;');
    });
  }
  else{
    db = new sqlite3.Database(dbpath, function (err) {
      if (err !== null) {
        console.log("ERR:"+dbpath+" doesn't exist and could not open.");
        return;
      }
      initdb();
    });
  }
  console.log("this might be null: "+db);
}
exports.open = open;

function initdb() {
  var sqlstr = "DROP TABLE IF EXISTS tags;DROP TABLE IF EXISTS paths;DROP TABLE IF EXISTS captions;DROP TABLE IF EXISTS tagnames;CREATE TABLE tagnames (tagid integer PRIMARY KEY, name varchar(80), UNIQUE (name) ON CONFLICT ROLLBACK);CREATE TABLE paths (pathid integer PRIMARY KEY, path varchar(240), UNIQUE (path) ON CONFLICT ROLLBACK);CREATE TABLE captions (captionid integer PRIMARY KEY, caption TEXT);CREATE TABLE tags (tagid integer, pathid integer, pos varchar(100), captionid integer, PRIMARY KEY (tagid, pathid, pos), FOREIGN KEY (tagid) REFERENCES tagnames(tagid) ON DELETE CASCADE, FOREIGN KEY (pathid) REFERENCES paths(pathid) ON DELETE CASCADE, FOREIGN KEY (captionid) REFERENCES captions(captionid) ON DELETE SET NULL);INSERT INTO tagnames VALUES (1, 'Paul');INSERT INTO paths VALUES (5, '/path/to/file/here.png');INSERT INTO captions VALUES (1, 'Fun day with Shane and Sherry!');INSERT INTO tags VALUES (1, 5, '{point:[40, 60], dx:10, dy:25}', 1);";
  db.exec(sqlstr, function (err){
    if(err !== null){
      console.log("FAILED to exec sqlstr for new db.");
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
      console.log(err);
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
            console.log(err);
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
      }
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
