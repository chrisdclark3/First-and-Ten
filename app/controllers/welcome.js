
app.controller('WelcomeCtrl', function($scope, $timeout) {

	$timeout(function () {
		console.log("IN TIMEOUT FUNCTION");
		var home = document.getElementById('home');
		home.setAttribute('class','after-load container');
	}, 6000, true);

	var start_time = new Date();
	var theLetters = "abcdefghijklmnopqrstuvwxyz#%&123456789";
	$scope.runHeader = function (phrase) {
		var start = 0;
		var phraseLength = phrase.length;
		var speed = 45;
		var increment = 4;
		var randLetterLength = 4;
		var si = 0;
		var stri = 0;
		var block = "";
		var fixed = "";

		(function jostle(i) {
			setTimeout(function() {
				if (--i) {
					jostle(i);
				}
				nextFrame(i);
				si = si + 1;
			}, speed);
		})(phraseLength * increment + 1);

		function nextFrame(pos) {
			for (var i = 0; i < randLetterLength; i++) {
				var num = Math.floor(theLetters.length * Math.random());
				var letter = theLetters.charAt(num);
				block += letter;
			}
			if (si == (increment - 1)) {
				stri++;
			}
			if (si == increment) {
				fixed = fixed + phrase.charAt(stri - 1);
				si = 0;
			}
			$scope.$apply(function() {
				if (fixed.length == phraseLength) {
					$scope.welcomeHeader = fixed;
					var end_time = new Date();
					console.log("DURATION", end_time - start_time);
				} else {
					$scope.welcomeHeader = fixed + block;
				}
				block = "";
			});
		}
	};
});
