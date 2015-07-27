var mongoose = require('mongoose');
var path = require("path");
var directory = path.resolve('./');
var Schema = mongoose.Schema;
var StorySchema = require(directory + '/server/models/story.js');
var deepPopulate = require('mongoose-deep-populate');
var findOrCreate = require('mongoose-findorcreate');

var RoomSchema = new mongoose.Schema({
	image: String,
	abbr: String,
	name: String,
  keywords: [],
  stories: [StorySchema]
});

RoomSchema.plugin(deepPopulate);
RoomSchema.plugin(findOrCreate);

var Room = mongoose.model('Room', RoomSchema);

module.exports = (function() { return Room; })();