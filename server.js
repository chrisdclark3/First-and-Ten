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
		socket.join(data.room._id);
		users[data.user.id] = data.user;
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
				io.to(roomId).emit('updateRoom', room);
			}
		});
	});

	socket.on('sendMessage', function(data) {
		Room.findOne({
			_id: data.roomId
		}, function(err, room) {
			var hasStory = false;
			var currentStory;
			var currentStoryIndex;
			var message = {
				content: data.content,
				user: data.currentUser
			};
			room.stories.forEach(function(story) {
				if (story.title == data.story.title) {
					hasStory = true;
					currentStory = story;
					currentStoryIndex = room.stories.indexOf(story);
				}
			});
			if (hasStory === false) {
				data.story.messages = [message];
				room.stories.push(data.story);
			} else {
				room.stories[currentStoryIndex].messages.push(message);
			}

			room.save();
			console.log('SERVER > NEW MESSAGE > UPDATED ROOM', room);
			io.to(data.roomId).emit('updateRoom', room);
		});
	});

	socket.on('deleteMessage', function(data) {
		console.log('SERVER > DELETE MESSAGE > QUERY DATA', data);
		Room.findOneAndUpdate({
				_id: data.roomId
			}, {
				$pull: {
					stories: {
						messages: {
							_id: data._id
						}
					}
				}
			}, {
				new: true
			},
			function (err, updatedRoom) {
				if (err) {
					socket.emit('errors', err);
				} else {
					console.log('SERVER > DELETE MESSAGE > ROOM', updatedRoom);
					console.log('SERVER > updatedRoom._id', updatedRoom._id);
					io.to(updatedRoom._id).emit('updateRoom', updatedRoom);
				}
			}
		);
	});
});

// socket.on('new_user', function (data) {
//   if (rooms[room].users) {
//     rooms[room].users.push(data);
//   } else {
//     rooms[room].users = [];
//     rooms[room].users.push(data);
//   }
//   io.to(room).emit('all_messages', rooms[room].messages);
// });



// socket.on('client_remove_user', function (data) {
//   for (var i = 0; i < rooms[room]['users'].length; i++) {
//     if (rooms[room].users[i]['name'] == data.name) {
//       rooms[room].users.splice(i,1);
//     }
//   }
// });