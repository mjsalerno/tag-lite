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