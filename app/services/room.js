app.factory('Room', function (Socket, $rootScope, localStorageService, $location) {

	factory = {};

	factory.currentRoom = localStorageService.get('currentRoom');

	factory.joinRoom = function (room) {
		Socket.emit('joinRoom', room);
	};

	factory.updateRoom = function (data) {
		localStorageService.set('currentRoom', data);
		factory.currentRoom = data;
	};

	Socket.on('updateRoom', function (data) {
		factory.updateRoom(data);
		$rootScope.$broadcast('roomUpdate', data);
	});

	Socket.on('setRoom', function (data) {
		factory.updateRoom(data);
		$location.path('/room');
	});

	return factory;

});