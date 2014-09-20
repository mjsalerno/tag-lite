DROP TABLE IF EXISTS tags;
DROP TABLE IF EXISTS paths;
DROP TABLE IF EXISTS tagnames;
CREATE TABLE tagnames (id integer PRIMARY KEY, name varchar(80));
CREATE TABLE paths (id integer PRIMARY KEY, path  varchar(240));
CREATE TABLE tags (id integer, pathid integer, pos varchar(100), caption TEXT, PRIMARY KEY (id, pathid, pos), FOREIGN KEY (id) REFERENCES tagnames(id) ON DELETE CASCADE, FOREIGN KEY (pathid) REFERENCES paths(id) ON DELETE CASCADE);
INSERT INTO tagnames VALUES (1, "Paul");
INSERT INTO paths VALUES (5, "/path/to/file/here.png");
INSERT INTO tags VALUES (1, 5, "{point:[40, 60], dx:10, dy:25}", "Fun day with Shane and Sherry!");
