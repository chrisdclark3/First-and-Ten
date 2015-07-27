app.factory('Message', function (Feed, Socket) {

	factory.sendMessage = function (queryData) {
		queryData.roomId = Feed.currentRoom._id;
		queryData.currentUser = Feed.currentUser;
		queryData.story = Feed.findStory(queryData.story.title);
		console.log('FACT > sendMessage > queryData', queryData);
		Socket.emit('sendMessage', queryData);
	};

	factory.deleteMessage = function (queryData) {
		console.log('SOCKET > deleteMessage > queryData', queryData);
		queryData.roomId = Feed.currentRoom._id;
		Socket.emit('deleteMessage', queryData);
	};

	return factory;

});