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
mongoose.connect('mongodb://chrisdclark3:password@ds047020.mongolab.com:47020/heroku_2hgp314f');
var Room = require(directory + '/server/controllers/room.js');

app.use(express.static('./app'));



// usernames which are currently connected to the chat
var users = {};
var messages = {};
var room;
// rooms which are currently available in chat

io.sockets.on('connection', function (socket) {

	socket.on('joinRoom', function (data) {
		Room.get(data, function (res) {
			socket.join(res.abbr);
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
			io.to(res.abbr).emit('updateRoom', res);
		});
	});

	socket.on('deleteMessage', function (data) {
		Room.destroy(data, function (res) {
			io.to(res.abbr).emit('updateRoom', res);
		});
	});

});