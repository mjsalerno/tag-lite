/*
var db = require('./db');
db.open('taglite.dbasdasd');
console.log("db: " + db);
var orig = 'Paul';
var modified = 'PaulieBoy!!!';
console.log('Renaming tag:');
console.log('renameTag retval: '+db.renameTag(orig, modified));
//console.log('Removing path: /path/to/');
//console.log('removePath retval: '+db.removePath('/path/to/'));

//console.log('updateFile: '+db.updateFile('/path/to/file/here.png', ['mike', 'scott'], 'My caption.'));
var paths = [];
db.search('Paul', paths)
console.log('Searching: '+paths);

db.close();
*/

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database("taglite.db", sqlite3.OPEN_READWRITE, function(err) {
	if(err) {
		
	}
});

db.serialize(function() {
	test('besttags');
	console.log("Hello, World");
});

function test(tagname) {
	db.run("INSERT INTO tagnames VALUES (null,(?))", tagname, function (err) {
	    if (err !== null) {
	      console.log(err);
	      return;
	    }
    	console.log("INSERT: " + this.changes);
  	});
	console.log("Inside Test");
}