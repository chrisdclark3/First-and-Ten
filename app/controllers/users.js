app.controller('UsersCtrl', function($scope, $facebook, $location, localStorageService) {

	$scope.currentUser = localStorageService.get('currentUser');

	$scope.isActive = function(viewLocation) {
		return viewLocation === $location.path();
	};

	$scope.login = function() {
		$facebook.login().then(function() {
			refresh();
		});
	};

	$scope.logout = function() {
		$facebook.logout().then(function() {
			localStorageService.remove('currentUser');
			$scope.isLoggedIn = false;
			$location.path('/');
		});
	};

	function refresh() {
		$facebook.api("/me").then(
			function(response) {
				console.log("RESPONSE", response);
				response.image = "http://graph.facebook.com/"+response.id+"/picture?type=normal";
				localStorageService.set('currentUser', response);
				$scope.isLoggedIn = true;
				$location.path('/rooms');
			},
			function(err) {
				$scope.errorMessage = "Please log in";
			});
	}

});