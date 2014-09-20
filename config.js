/* Configuration file for the  server */
var config = {};

/* The port number that the monitor server listens on */
config.port = process.env.PORT || 3000;

/* Root directory of the webserver which serves static content */
config.root = process.env.ROOT || 'public';

/* The extentions to look for */
config.extentions = ['png', 'jpg'];

/* Make this variable public to files that import it */
module.exports = config;