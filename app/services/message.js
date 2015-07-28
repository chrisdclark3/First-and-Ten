app.factory('Message', function (Feed, Room, Socket) {

	factory.sendMessage = function (queryData) {
		console.log('FACT > sendMessage > queryData', queryData);
		Socket.emit('sendMessage', queryData);
	};

	factory.deleteMessage = function (queryData) {
		console.log('FACT > deleteMessage > queryData', queryData);
		queryData.roomId = Room.currentRoom._id;
		Socket.emit('deleteMessage', queryData);
	};

	return factory;

});