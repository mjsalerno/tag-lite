var remote = require('remote');
var dialog = remote.require('dialog');
var browserWindow = remote.getCurrentWindow();

// Get the home directory
var home = process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE;

$("#trackfiles").click(function() {
	// open the file dialoug to track files
	dialog.showOpenDialog(browserWindow, {defaultPath: home, properties: [ 'openDirectory', 'openFile', 'multiSelections' ]} , function(selectedPath) {
  		if(selectedPath) {
  			console.log(selectedPath);
  		}
	});
});

/* All calls made to server are contained in this object */
function Calls() {
	this.search = function(tags) {
		socket.emit('search', {'tagnames': tags});
	};

	this.add_dirs = function(directories, tags) {
		socket.emit('add-dirs', {'directories': directories, 'tagnames': tags});
	};

	this.untrack_dirs = function(directories) {
		socket.emit('untrack-dirs', {'directories': directories});
	};

	this.untrack_files = function(files) {
		socket.emit('untrack-files', {'files': files});
	};

	this.update_file = function(file, tags, caption) {
		socket.emit('update-file', {file: {
			'tagnames': tags,
			'caption': caption
		}});
	};

	this.add_files = function(files, tags) {
		socket.emit('add-files', {'files': files, 'tagnames': tags});
	};

	this.add_tag_names = function(tags) {
		socket.emit('add-tag-names', {'tagnames': tags});
	};

	this.edit_tag_name = function(original_tag, new_tag) {
		socket.emit('edit-tag-name', {'original': original_tag, 'modified': new_tag});
	};

	this.delete_tag_names = function(tags) {
		socket.emit('delete-tag-names', {'tagnames': tags});
	};
}

/* Construct an instance of the object */
var api = new Calls();

$("#search").click(function() {
	var tags = $("#input").val().split(' ');
	api.search(tags);
});

$("#adddirs").click(function() {
	var dirs = $("#input").val().split(' ');
	api.add_dirs(dirs, ['random', 'tags']);
});

$("#untrackdirs").click(function(){
	var dirs = $("#input").val().split(' ');
	api.untrack_dirs(dirs);
});

$("#untrackfiles").click(function(){
	var files = $("#input").val().split(' ');
	api.untrack_files(files);
});

$("#updatefile").click(function(){
	var attrs = $("#input").val().split(' ');
	api.untrack_dirs(attrs[0], attrs[1], attrs[2]);
});

$("#addfiles").click(function(){
	var files = $("#input").val().split(' ');
	api.add_files(files, ['random', 'tags']);
});

$("#addtags").click(function() {
	var tags = $("#input").val().split(' ');
	api.add_tag_names(tags);
});

$("#edittagname").click(function() {
	var attrs = $("#input").val().split(' ');
	api.edit_tag_name(attrs[0], attrs[1]);
});

$("#deletetag").click(function() {
	var tags = $("#input").val().split(' ');
	api.delete_tag_names(tags);
});