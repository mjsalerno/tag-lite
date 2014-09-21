var remote = require('remote');
var dialog = remote.require('dialog');
var browserWindow = remote.getCurrentWindow();
var ipc = require('ipc');

// Get the home directory
var home = process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE;

/* right click menus */
context.init({
	fadeSpeed: 100,
	filter: function($obj){},
	above: 'auto',
	preventDoubleContext: true,
	compress: true
});

/* All calls made to server are contained in this object */
function Calls() {
	this.search = function(tags) {
		ipc.send('search', {'tagnames': tags});
	};

	this.add_dirs = function(directories, tags) {
		ipc.send('add-dirs', {'directories': directories, 'tagnames': tags});
	};

	this.untrack_dirs = function(directories) {
		ipc.send('untrack-dirs', {'directories': directories});
	};

	this.untrack_files = function(files) {
		ipc.send('untrack-files', {'files': files});
	};

	this.update_file = function(file, tags, caption) {
		ipc.send('update-file', {file: {
			'tagnames': tags,
			'caption': caption
		}});
	};

	this.add_files = function(files, tags) {
		ipc.send('add-files', {'files': files, 'tagnames': tags});
	};

	this.add_tag_names = function(tags) {
		ipc.send('add-tag-names', {'tagnames': tags});
	};

	this.edit_tag_name = function(original_tag, new_tag) {
		ipc.send('edit-tag-name', {'original': original_tag, 'modified': new_tag});
	};

	this.delete_tag_names = function(tags) {
		ipc.send('delete-tag-names', {'tagnames': tags});
	};
}

function setActive(template, makeActive) {
	$("#content").empty().load(template);
	$("li").removeClass("active");
	$(makeActive).parent().addClass("active");
}

/* Construct an instance of the object */
var api = new Calls();

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

$("#trackfiles").click(function() {
	// open the file dialoug to track files
	dialog.showOpenDialog(browserWindow, {title: "Select one or more files.", defaultPath: home, properties: ['openFile', 'multiSelections'], filters: [{ name: 'Images', extensions: ['jpg', 'png', 'gif'] }]} , function(selectedPath) {
  		if(selectedPath) {
  			setActive("templates/overview.html", "#overview");
  			// Remove all the current images
  			$("#images").empty().append("<img src='img/loading.gif' alt='loading' />");
  			// Add files to the page
  			for(var i in selectedPath) {
  				var path = selectedPath[i];
  				var anc = $("<a>").attr("href", path).attr("data-lightbox", "none").attr("class", "class='col-xs-6 col-sm-2 placeholder'");
  				var img = $("<img src='" + path + "' style='width: 100px; height:100px;'/>");
  				anc.append(img);
  				// Add image to the page
  				$("#images").append(anc);
  			}
  			// Add files on server side
  			api.add_files(selectedPath, []);
  		}
	});
});

$("#trackdirs").click(function() {
	// open the file dialoug to track files
	dialog.showOpenDialog(browserWindow, {title: "Select one or more directories.", defaultPath: home, properties: ['openDirectory', 'multiSelections']} , function(selectedPath) {
  		if(selectedPath) {
  			setActive("templates/overview.html", "#overview");
  			// Remove all the current images
  			$("#images").empty().append("<img src='img/loading.gif' alt='loading' />");
  			api.add_files(selectedPath, []);
  		}
	});
});

$('#search').keydown(function(event) {
    if (event.keyCode == 13) {
    	setActive("templates/overview.html", "#overview");
    	var tags = $("#search").val().split(' ');
    	// Clear out currently loaded images
    	$("#images").empty().append("<img src='img/loading.gif' alt='loading' />");
    	// Ask to search for images
		api.search(tags);
		// Reset the text
		$("#search").val("");
        return false;
     }
});

$("#help").click(function(){
	$("#content").empty().load("templates/help.html");
	$("li").removeClass("active");
});

$("#dash").click(function(){
	setActive("templates/overview.html", "#overview");
});

$("#overview").click(function(){
	setActive("templates/overview.html", "#overview");
});

$("#tagmanagement").click(function(){
	setActive("templates/managetags.html", "#tagmanagement");
});

$(document).ready(function(){
	$("#content").empty().load("templates/overview.html");
});
