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
		console.log("SOCKET > setRoom > resData", resData);
		localStorageService.remove('currentRoom');
		localStorageService.set('currentRoom', resData);
		factory.currentRoom = resData;
		$rootScope.$broadcast('roomSet', resData);
	});

	factory.getRoom = function (queryData) {
		queryData.roomId = factory.currentRoom._id;
		queryData.user = factory.currentUser;
		Socket.emit('getRoom', queryData);
	};

	factory.updateRoom = function (resData) {
		console.log('FACT > updateRoom > resData', resData);
		factory.currentRoom = resData;
		localStorageService.set('currentRoom', resData);
		$rootScope.$broadcast('roomUpdate', resData);
	};

	Socket.on('updateRoom', function (resData) {
		console.log('SOCKET > updateRoom > resData', resData);
		factory.updateRoom(resData);
	});

	Socket.on('errors', function (error) {
		$rootScope.$broadcast('error', error);
	});

	return factory;

});