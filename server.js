var express = require('express');
var app = express();
var port = process.env.PORT || 6789;
var server = require('http').createServer(app);
server.listen(port);
var fs = require('fs');
var path = require("path");
var directory = path.resolve('./');
var io = require('socket.io')(server);
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/1stand10');
var Room = require(directory + '/server/controllers/room.js');

app.use(express.static('./app'));



// usernames which are currently connected to the chat
var users = {};
var messages = {};
var room;
// rooms which are currently available in chat

io.sockets.on('connection', function (socket) {

	socket.on('joinRoom', function (data) {
		console.log('\n\n\njoinRoom > data', data, '\n\n\n');
		Room.get(data, function (res) {
			socket.join(res.abbr);
			console.log('\n\n\njoinRoom > res', res, '\n\n\n');
			io.to(res.abbr).emit('setRoom', res);
		});
	});

	socket.on('getRooms', function () {
		Room.get({}, function (res) {
			io.emit('allRooms', res);
		});
	});

	socket.on('sendMessage', function (data) {
		Room.post(data, function (res) {
			console.log("\n\n\nSEND MESSAGE RES", res);
			io.to(res.abbr).emit('updateRoom', res);
		});
	});

	socket.on('deleteMessage', function (data) {
		console.log('SERVER > DELETE MESSAGE > QUERY DATA', data);
		Room.destroy(data, function (res) {
			console.log('SERVER > DELETE MESSAGE > RES', res);
			io.to(res.abbr).emit('updateRoom', res);
		});
	});

});