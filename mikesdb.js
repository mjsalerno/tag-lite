var dblite = require('dblite').withSQLite('3.8.6+');
var db;

function open(dbanme) {
     db = dblite('db');
}
exports.open = open;

function close(dbanme) {
     db.close();
}
exports.close = close;

function q(stuff) {
     db.query(stuff);
}
exports.q = q;

function addFile(path) {
  db.query("INSERT INTO paths VALUES (null, (?))", [path], function (err, rows) {
    //var record = rows[0];
    if (err !== null) {
      console.log(err);
      return;
    }
    console.log("INSERT: "+rows);
  });
}
exports.addFile = addFile;

function init() {
    db.query('DROP TABLE IF EXISTS tags');
    db.query('DROP TABLE IF EXISTS paths');
    db.query('DROP TABLE IF EXISTS captions');
    db.query('DROP TABLE IF EXISTS tagnames');
    db.query('CREATE TABLE tagnames (tagid integer PRIMARY KEY, name varchar(80), UNIQUE (name) ON CONFLICT ROLLBACK)');
    db.query('CREATE TABLE paths (pathid integer PRIMARY KEY, path varchar(240), UNIQUE (path) ON CONFLICT ROLLBACK)');
    db.query('CREATE TABLE captions (captionid integer PRIMARY KEY, caption TEXT)');
    db.query('CREATE TABLE tags (tagid integer, pathid integer, pos varchar(100), captionid integer, PRIMARY KEY (tagid, pathid, pos), FOREIGN KEY (tagid) REFERENCES tagnames(tagid) ON DELETE CASCADE, FOREIGN KEY (pathid) REFERENCES paths(pathid) ON DELETE CASCADE, FOREIGN KEY (captionid) REFERENCES captions(captionid) ON DELETE SET NULL)');
    db.query('INSERT INTO tagnames VALUES (1, "Paul")');
    db.query('INSERT INTO paths VALUES (5, "/path/to/file/here.png")');
    db.query('INSERT INTO captions VALUES (1, "Fun day with Shane and Sherry!")');
    db.query('INSERT INTO tags VALUES (1, 5, "{point:[40, 60], dx:10, dy:25}", 1)');
}
exports.init = init;

function removePath(path) {
  db.query("DELETE FROM paths WHERE path LIKE (?)", [path], function (err, rows) {
    if (err !== null) {
      console.log(err);
      return;
    }
    console.log("DELETE: "+this.changes);
  });
}
exports.removePath = removePath;
