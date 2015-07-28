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
var Room = require(directory + '/server/models/room.js');

app.use(express.static('./app'));



// usernames which are currently connected to the chat
var users = {};
var messages = {};
var room;
// rooms which are currently available in chat

io.sockets.on('connection', function(socket) {
	socket.on('joinRoom', function(data) {
		console.log("SERVER > joinRoom > data", data);
		socket.join(data.room.abbr);
		users[data.user.id] = data.user;
		room = data.room;
		socket.emit('setRoom', data.room);
	});

	socket.on('getRooms', function() {
		Room.find({}, function(err, data) {
			console.log('SERVER > GET ROOMS > DATA', data);
			if (err) {
				console.log("ERROR IN GET ROOM", err);
			} else {
				io.emit('allRooms', data);
			}
		});
	});

	socket.on('getRoom', function(data) {
		console.log('SERVER > GET ROOM > DATA', data);
		Room.findOne({
			_id: data._id
		}, function(err, room) {
			if (err) {
				socket.emit('errors', err);
			} else {
				io.to(room.abbr).emit('updateRoom', room);
			}
		});
	});

	socket.on('sendMessage', function(data) {
		console.log('\n\nSERVER > data', data, '\n\n');
		Room.findOne({
			_id: data.roomId
		}, function(err, aRoom) {
			var hasStory = false;
			var currentStory;
			var currentStoryIndex;
			var message = {
				content: data.content,
				user: data.currentUser
			};
			aRoom.stories.forEach(function(story, idx) {
				console.log('SERVER > aRoom.stories.forEach > story.title AND data.story.title', story.title, data.story.title);
				if (story.title == data.story.title) {
					hasStory = true;
					currentStory = story;
					currentStoryIndex = idx;
				}
			});
			if (hasStory != true) {
				data.story.messages = [message];
				aRoom.stories.push(data.story);
				aRoom.save();
			} else {
				aRoom.stories[currentStoryIndex].messages.push(message);
				aRoom.save();
			}
			console.log('SERVER > NEW MESSAGE > UPDATED ROOM', aRoom);
			io.to(aRoom.abbr).emit('updateRoom', aRoom);
		});
	});

	socket.on('deleteMessage', function(data) {
		console.log('SERVER > DELETE MESSAGE > QUERY DATA', data);
		Room.findOne({
			'_id': data.roomId
		}, function(err, aRoom) {
			if (err) {
				socket.emit('errors', err);
			} else {
				aRoom.stories.forEach(function (story, storyIdx) {
					story.messages.forEach( function (msg, messageIdx) {
						if (msg._id == data._id) {
							story.messages.splice(messageIdx, 1);
						}
					});
					if (story.messages.length == 0) {
						aRoom.stories.splice(storyIdx, 1);
					}
				});

				aRoom.save();
				console.log('SERVER > DELETE MESSAGE > ROOM', aRoom);
				console.log('SERVER > aRoom._id', aRoom._id);
				console.log('SERVER > aRoom', aRoom);
				io.to(aRoom.abbr).emit('updateRoom', aRoom);
			}
		});
	});
});