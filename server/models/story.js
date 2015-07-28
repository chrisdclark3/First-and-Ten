var mongoose = require('mongoose');
var path = require("path");
var directory = path.resolve('./');
var Schema = mongoose.Schema;
var MessageSchema = require(directory + '/server/models/message.js');
var findOrCreate = require('mongoose-findorcreate');

var StorySchema = new mongoose.Schema({
  author: String,
  categories: [],
  content: String,
  contentSnippet: String,
  link: String,
  title: String,
  image: String,
  messages: [MessageSchema]
});

StorySchema.plugin(findOrCreate);

module.exports = StorySchema;