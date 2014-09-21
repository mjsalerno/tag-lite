var app = require('app');  // Module to control application life.
var BrowserWindow = require('browser-window');  // Module to create native browser window.
var dialog = require('dialog');
var Screen = require('screen');
var backend = require('./backend');
var ipc = require('ipc');

// Get the screen dimensions
var size = Screen.getPrimaryDisplay().workAreaSize;

// Report crashes to our server.
require('crash-reporter').start();

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the javascript object is GCed.
var mainWindow = null;

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  if (process.platform != 'darwin')
    app.quit();
});

// This method will be called when atom-shell has done everything
// initialization and ready for creating browser windows.
app.on('ready', function() {
  backend.setupIPC(ipc);

  // Create the browser window.
  mainWindow = new BrowserWindow({width: size.width, height: size.height});
  mainWindow.maximize();

  // and load the index.html of the app.
  mainWindow.loadUrl('file://' + __dirname + '/public/index.html');

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
});