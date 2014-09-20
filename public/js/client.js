/* Connect to the websocket */
var socket = io.connect(document.URL);
	socket.on('news', function (data) {
	console.log(data);
	socket.emit('my other event', { my: 'data' });
});
