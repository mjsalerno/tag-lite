var db = require('./mikesdb');

db.open('dbdb');
db.init();
db.addFile('/cool/book');
db.q('COMMIT');
//db.removePath('/cool/book');
db.close();