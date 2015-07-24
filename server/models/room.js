var mongoose = require('mongoose');
var path = require("path");
var directory = path.resolve('./');
var Schema = mongoose.Schema;
var MessageSchema = require(directory + '/server/models/message.js');

var RoomSchema = new mongoose.Schema({
	messages: [MessageSchema],
	image: String,
	abbr: String,
	name: String
});

var Room = mongoose.model('Room', RoomSchema);

module.exports = (function() {

	return Room;

})();