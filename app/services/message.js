app.factory('Message', function (Feed, Room, Socket) {

	factory.sendMessage = function (queryData) {
		console.log('FACT > sendMessage > queryData', queryData);
		Socket.emit('sendMessage', queryData);
	};

	factory.deleteMessage = function (queryData) {
		console.log('FACT > deleteMessage > queryData', queryData);
		queryData.room = Room.currentRoom;
		Socket.emit('deleteMessage', queryData);
	};

	return factory;

});