app.controller('UsersCtrl', function($scope, $rootScope, $facebook, $location, localStorageService) {
	if ($rootScope.currentUser == undefined) {
		$rootScope.currentUser = localStorageService.get('currentUser');
	}

	$scope.isActive = function(viewLocation) {
		return viewLocation === $location.path();
	};

	$scope.login = function() {
		$facebook.login().then(function() {
			refresh();
		});
	};

	$scope.loginBasic = function (name) {
		var id = Math.random() * 1000000000;
		var currentUser = {};
		currentUser.name = name;
		currentUser.id = id;
		currentUser.image = 'https://s3.amazonaws.com/nflteamchat/default.jpeg';
		console.log('loginBasic > currentUser', currentUser);
		localStorageService.remove('currentUser');
		localStorageService.set('currentUser', currentUser);
		$rootScope.currentUser = currentUser;
		$scope.isLoggedIn = true;
		$location.path('/rooms');
	};

	$scope.logout = function() {
		$facebook.logout().then(function() {
			localStorageService.remove('currentUser');
			$rootScope.isLoggedIn = false;
			$location.path('/');
		});
	};

	function refresh() {
		$facebook.api("/me").then(
			function (response) {
				console.log("RESPONSE", response);
				response.image = "http://graph.facebook.com/"+response.id+"/picture?type=normal";
				localStorageService.set('currentUser', response);
				console.log('login > currentUser', response);
				$rootScope.isLoggedIn = true;
				$location.path('/rooms');
			},
			function(err) {
				$scope.errorMessage = "Please log in";
			});
	}

});