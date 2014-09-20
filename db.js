// database init

var sqlite3 = require('sqlite3').verbose();
var nodb = false;

function open (dbpath) {
	var db = new sqlite3.Database('taglite.db', 
	sqlite3.OPEN_READWRITE,
	function(err){
		if(err == null){
			// db exits
			console.log("Database opened!");
		}
		else{
			nodb = true;
			console.log("Database not found!");
			// must create db
			// db = new sqlite3.Database('taglite.db');
		}
	});
	if(nodb){
		db = new sqlite3.Database('taglite.db');
		console.log("Database created!");
	}
}

console.log(db);

db.serialize(function () {
	//db.each("SELECT * FROM tag", function(err, row) {
		//console.log(row);
		//console.log(row.id, row.path, row.pos);
		//console.log(row.id + '\n' + row.path + '\n' + row.pos);
	//});
})


/**

CREATE TABLE tagnames (id integer PRIMARY KEY, name varchar(80));
CREATE TABLE paths (id integer PRIMARY KEY, path  varchar(240));
CREATE TABLE tags (
id integer,
pathid integer,
pos varchar(100),
caption TEXT,
PRIMARY KEY (id, pathid, pos),
FOREIGN KEY (id) REFERENCES tagnames(id) ON DELETE CASCADE,
FOREIGN KEY (pathid) REFERENCES paths(id) ON DELETE CASCADE
);
INSERT INTO tagnames VALUES (1, "Paul");
INSERT INTO paths VALUES (5, "/path/to/file/here.png");
INSERT INTO tags VALUES (1, 5, "{point:[40, 60], dx:10, dy:25}", "Fun day with Shane and Sherry!");

**/