
app.factory('News', function ($http) {
	var output = [];
	$http({
		method: 'GET',
		url: 'http://sports.espn.go.com/espn/rss/nfl/news',
		headers: {
			'Access-Control-Allow-Origin': '*'
		}
	}).success(function(res) {
		console.log(res);
	});
});

app.controller('ChatRoomCtrl', function($scope, $rootScope, Socket, Room, News, localStorageService) {

	$scope.currentUser = Room.currentUser;
	$scope.currentRoom = Room.currentRoom;

	$scope.getRoom = function() {
		Room.getRoom($scope.currentRoom);
	};

	$scope.sendMessage = function() {
		Room.sendMessage($scope.newMessage);
		$scope.newMessage.content = "";
	};

	$scope.deleteMessage = function(data) {
		console.log('CTRL > deleteMessage > data', data);
		Room.deleteMessage(data);
	};

	$scope.$on('roomUpdate', function(event, data) {
		$scope.currentRoom = data;
	});

	$scope.$on('error', function(event, data) {
		$scope.errors = data;
	});

});
