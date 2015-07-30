app.controller('RoomCtrl', function ($scope, $rootScope, Room, Feed, Message, localStorageService, $location) {

	Feed.initialize();
	$scope.currentRoom = localStorageService.get('currentRoom');
	Room.joinRoom($scope.currentRoom);


	$scope.$on('roomUpdate', function (event, data) {
		Feed.initialize();
		console.log("scope.on roomUpdate > data OUTSIDE", data);
		$scope.currentRoom = data;
	});

	$scope.$on('feedUpdate', function(event, sortedFeedData, feedSrc) {
		$scope.sortedFeed = sortedFeedData;
		$scope.feedSrc = feedSrc;
	});


	function clearSearchFeed () {
		if ($scope.searchFeed.length == 1 && ($scope.newMessage.story.title == $scope.searchFeed[0])) {
			$scope.searchFeed = "";
		}
	}

	$scope.search = function() {
		if ($scope.newMessage.story.title != "") {
			var searchFeed = [];
			$scope.sortedFeed.forEach(function(story) {
				if (story.title.indexOf($scope.newMessage.story.title) != -1) {
					searchFeed.push(story);
				}
			});
			$scope.searchFeed = searchFeed;
			clearSearchFeed();
		} else {
			$scope.searchFeed = "";
		}
	};

	$scope.setMessageStory = function(title) {
		$scope.newMessage.story.title = title;
		$scope.searchFeed = "";
	};

	function clearMessageAndFeed () {
		$scope.newMessage = "";
		$scope.searchFeed = "";
	}

	function prepMessage () {
		$scope.newMessage.room = $scope.currentRoom;
		$scope.newMessage.currentUser = $rootScope.currentUser;
		$scope.newMessage.story = Feed.findStory($scope.newMessage.story.title);
	}

	$scope.sendMessage = function () {
		prepMessage();
		console.log("Send message", $scope.newMessage);
		Message.sendMessage($scope.newMessage);
		clearMessageAndFeed();
	};

	$scope.deleteMessage = function (data) {
		Message.deleteMessage(data);
	};

	$scope.setFeedUrl = function(url, name) {
		Feed.setFeedUrl(url, name);
	};

});