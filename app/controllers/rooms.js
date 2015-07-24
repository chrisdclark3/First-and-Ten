app.controller('RoomsCtrl', function($scope, Room, $http, $modal, Socket, $location, localStorageService) {
	// Set scope for current user session
	$scope.currentUser = localStorageService.get('currentUser');
    console.log("ROOMS > Socket", Socket);
	// Get all rooms
	Socket.emit('getRooms');
	Socket.on('allRooms', function(data) {
		$scope.rooms = data;
        console.log("ALL ROOMS", data);
	});

	// Join a particular chat room
	$scope.joinRoom = function(room) {
        console.log("ROOMS > joinRoom > room", room);
		Room.joinRoom(room);
	};

    $scope.$on('roomSet', function (event) {
        $location.path('/room');
    });


	console.log("CURRENT USER IN RoomsCtrl", $scope.currentUser);
	console.log("LOCAL STORAGE SERVICE IN RoomsCtrl", localStorageService.get('currentUser'));
});