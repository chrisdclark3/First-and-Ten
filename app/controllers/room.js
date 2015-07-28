app.controller('RoomCtrl', function ($scope, $rootScope, Room, Feed, Message, localStorageService) {

	$scope.currentUser = localStorageService.get('currentUser');
	$scope.currentRoom = localStorageService.get('currentRoom');
	Room.joinRoom($scope.currentRoom);

	$scope.getRoom = function () {
		Room.getRoom($scope.currentRoom);
	};

	$scope.$on('roomUpdate', function (event, data) {
		console.log("CONTROLLER > roomUpdate > data", data);
		$scope.currentRoom = data;
	});

	$scope.$on('roomSet', function (event, data) {
		console.log("CTRL > roomSet > localStorageService.get(currentRoom)", localStorageService.get('currentRoom'));
		$scope.currentRoom = data;
	});

	$scope.$on('error', function (event, data) {
		$scope.errors = data;
	});

	Feed.initialize();

	$scope.$on('feedUpdate', function(event, sortedFeedData, feedSrc) {
		console.log('BROAD > feedUpdate > sortedFeedData', sortedFeedData);
		$scope.sortedFeed = sortedFeedData;
		$scope.feedSrc = feedSrc;
	});

	$scope.search = function() {
		console.log("CTRL > search > input", $scope.newMessage);
		if ($scope.newMessage.story.title != "") {
			var searchFeed = [];
			$scope.sortedFeed.forEach(function(story) {
				if (story.title.indexOf($scope.newMessage.story.title) != -1) {
					searchFeed.push(story.title);
				}
			});
			$scope.searchFeed = searchFeed;
			console.log("CTRL > search > searchFeed", $scope.searchFeed);
			if ($scope.searchFeed.length == 1 && ($scope.newMessage.story.title == $scope.searchFeed[0])) {
				$scope.searchFeed = "";
			}
		} else {
			$scope.searchFeed = "";
		}
	};

	$scope.setMessageStory = function(title) {
		$scope.newMessage.story.title = title;
		$scope.searchFeed = "";
	};

	$scope.sendMessage = function () {
		console.log('CTRL > sendMessage > scope.newMessage', $scope.newMessage);
		$scope.newMessage.roomId = Room.currentRoom._id;
		$scope.newMessage.currentUser = Room.currentUser;
		$scope.newMessage.story = Feed.findStory($scope.newMessage.story.title);
		Message.sendMessage($scope.newMessage);
		$scope.newMessage.content = "";
	};

	$scope.deleteMessage = function (data) {
		console.log('CTRL > deleteMessage > data', data);
		Message.deleteMessage(data);
	};

	$scope.setFeedUrl = function(url, name) {
		Feed.setFeedUrl(url, name);
	};

});