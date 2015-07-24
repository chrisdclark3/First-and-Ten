app.factory('Room', function (Socket, $rootScope, localStorageService) {

	factory = {};

	factory.currentRoom = localStorageService.get('currentRoom');
	factory.currentUser = localStorageService.get('currentUser');
	console.log("FACT > Socket", Socket);
	console.log("\nFACT CURRENT ROOM", factory.currentRoom, " \n");

	factory.joinRoom = function (room) {
		Socket.emit('joinRoom', {
			room: room,
			user: factory.currentUser
		});
	};

	Socket.on('setRoom', function (resData) {
		localStorageService.remove('currentRoom');
		localStorageService.set('currentRoom', resData);
		factory.currentRoom = resData;
		$rootScope.$broadcast('roomSet');
	});


	factory.getRoom = function (queryData) {
		queryData.roomId = this.currentRoom._id;
		queryData.user = this.currentUser;
		Socket.emit('getRoom', queryData);
	};


	factory.updateRoom = function (resData) {
		console.log('FACT > updateRoom > resData', resData);
		this.currentRoom = resData;
		localStorageService.set('currentRoom', resData);
		$rootScope.$broadcast('roomUpdate', resData);
	};

	Socket.on('updateRoom', function (resData) {
		console.log('SOCKET > updateRoom > resData', resData);
		factory.updateRoom(resData);
	});

	factory.sendMessage = function (queryData) {
		queryData.roomId = this.currentRoom._id;
		queryData.currentUser = this.currentUser;
		Socket.emit('sendMessage', queryData);
	};

	factory.deleteMessage = function (queryData) {
		console.log('SOCKET > deleteMessage > queryData', queryData);
		queryData.roomId = this.currentRoom._id;
		Socket.emit('deleteMessage', queryData);
	};

	Socket.on('errors', function (error) {
		$rootScope.$broadcast('error', error);
	});

	return factory;

});