app.factory('News', function($http) {

	factory = {};

	factory.allNews = ["some value"];

	factory.getNews = function() {
		$http({
			method: 'GET',
			url: 'http://sports.espn.go.com/espn/rss/nfl/news',
			headers: {
				'Access-Control-Allow-Origin': '*'
			}
		}).success(function(res) {
			console.log(res);
		});
	};

	return factory;
});