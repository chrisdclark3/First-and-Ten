app.controller("FeedCtrl", function ($scope, $sce, $rootScope, Feed, Message) {

	Feed.initialize();

	$scope.$on('feedUpdate', function(event, sortedFeedData) {
		console.log('BROAD > feedUpdate > sortedFeedData', sortedFeedData);
		$scope.sortedFeed = sortedFeedData;
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
		Message.sendMessage($scope.newMessage);
		$scope.newMessage.content = "";
	};

	$scope.deleteMessage = function (data) {
		console.log('CTRL > deleteMessage > data', data);
		Message.deleteMessage(data);
	};

});