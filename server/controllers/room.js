var path = require("path");
var directory = path.resolve('./');
var Room = require(directory + '/server/models/room.js');

module.exports = (function () {

	return {

		get: function (data, callback) {
			var query = {};
			if (data._id) {
				query = {
					_id: data._id
				};
				Room.findOne(query, function (err, res) {
					if (err) {
						console.log('SERVER > get > err', err);
					} else {
						callback(res);
					}
				});
			} else {
				Room.find(query, function (err, res) {
					if (err) {
						console.log('SERVER > get all > err', err);
					} else {
						callback(res);
					}
				});
			}
		},

		post: function (data, callback) {
			Room.findOne({
				_id: data.room._id
			}, function (err, res) {
				var hasStory = false,
					currentStory, currentStoryIndex;
				var message = {
					content: data.content,
					user: data.currentUser
				};
				res.stories.forEach(function (story, idx) {
					if (story.title == data.story.title) {
						hasStory = true;
						currentStory = story;
						currentStoryIndex = idx;
					}
				});
				if (hasStory != true) {
					data.story.messages = [message];
					res.stories.push(data.story);
					res.save();
				} else {
					res.stories[currentStoryIndex].messages.push(message);
					res.save();
				}
				callback(res);
			});
		},

		destroy: function (data, callback) {
			Room.findOne({
				_id: data.room._id
			}, function (err, res) {
				if (err) {
					console.log("SERVER > destroy > err", err);
				} else {
					res.stories.forEach(function (story, storyIdx) {
						story.messages.forEach(function (msg, messageIdx) {
							if (msg._id == data._id) {
								story.messages.splice(messageIdx, 1);
							}
						});
						if (story.messages.length == 0) {
							res.stories.splice(storyIdx, 1);
						}
					});
					res.save();
					callback(res);
				}
			});
		}
	};
})();