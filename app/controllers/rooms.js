app.controller('RoomsCtrl', function($scope, $rootScope, Room, $http, $modal, Socket, $location, localStorageService) {

  // Get all rooms from the database and set scope
	Socket.emit('getRooms');
	Socket.on('allRooms', function(data) {
		$scope.rooms = data;
	});


  $scope.joinRoom = function(room) {
    console.log('RoomsCtrl > joinRoom > room', room);
    Room.joinRoom(room);
  };

});