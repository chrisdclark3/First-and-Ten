app.factory('Feed', function ($q, $sce, $resource, $rootScope, Room, localStorageService, $log, $timeout) {

	var factory = {};

	factory.feedUrl = 'http://sports.espn.go.com/espn/rss/nfl/news';
	factory.feedSrc = 'ESPN';
	factory.feed = localStorageService.get('feed');
	factory.sortedFeed = localStorageService.get('sortedFeed');

	factory.trustStory = function(story) {
		for (var i = 0; i < story.length; i++) {
			$sce.trustHtml(story[i]);
		}
	};

	function formatDate (story) {
		return new Date(story.publishedDate);
	}

	function sortFeed (story) {
		var includeStory = false;
		for (var i = 0; i < Room.currentRoom.keywords.length; i++) {
			var word = Room.currentRoom.keywords[i];
			if (story.content.toLowerCase().indexOf(word) != -1 || story.title.toLowerCase().indexOf(word) != -1) {
				includeStory = true;
			}
		}
		return includeStory;
	}

	function config () {
		return $q(function (resolve, reject) {
			var feed = new google.feeds.Feed(factory.feedUrl);
			feed.setNumEntries(300);
			feed.includeHistoricalEntries();
			feed.load(function (result) {
				console.log("FACT > feed.load result", result);
				if (!result.error) {
					resolve(result.feed.entries);
				} else {
					reject("Error: feed was unable to load");
				}
			});
		});
	}

	factory.initialize = function () {
		var feed = config();
		feed.then(function (newFeed) {
			var sortedFeed = [];
			newFeed.forEach(function (story) {
				if (sortFeed(story)) {
					factory.trustStory(story);
					story.publishedDate = formatDate(story);
					story.author = factory.feedSrc;
					story.image = 'https://s3.amazonaws.com/nflteamchat/logos/' + factory.feedSrc.toLowerCase() + '.jpeg';
					sortedFeed.push(story);
				}
			});
			console.log("FACT > initialize > sortedFeed", sortedFeed);

			localStorageService.set('sortedFeed', sortedFeed);
			factory.sortedFeed = sortedFeed;

			$rootScope.$broadcast('feedUpdate', sortedFeed, factory.feedSrc);
		});
	};

	factory.findStory = function (input) {
		var storyRes = "ERROR: could not find story";
		factory.sortedFeed.forEach(function (story) {
			if (story.title == input) {
				storyRes = story;
			}
		});
		return storyRes;
	};

	factory.sendMessage = function (queryData) {
		console.log('FACT > sendMessage > queryData', queryData);
		queryData.roomId = Room.currentRoom._id;
		queryData.currentUser = Room.currentUser;
		queryData.story = Feed.findStory(queryData.story.title);
		Socket.emit('sendMessage', queryData);
	};

	factory.deleteMessage = function (queryData) {
		console.log('SOCKET > deleteMessage > queryData', queryData);
		queryData.roomId = Room.currentRoom._id;
		Socket.emit('deleteMessage', queryData);
	};

	factory.setFeedUrl = function (url, name) {
		factory.feedUrl = url;
		factory.feedSrc = name;
		factory.initialize();
	};

	return factory;

});