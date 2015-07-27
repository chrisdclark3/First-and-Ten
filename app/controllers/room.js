app.controller('RoomCtrl', function ($scope, $rootScope, Room, localStorageService) {

	$scope.currentUser = Room.currentUser;
	$scope.currentRoom = Room.currentRoom;

	$scope.getRoom = function () {
		Room.getRoom($scope.currentRoom);
	};

	$scope.$on('roomUpdate', function (event, data) {
		Room.currentRoom = data;
	});

	$scope.$on('error', function (event, data) {
		$scope.errors = data;
	});

});