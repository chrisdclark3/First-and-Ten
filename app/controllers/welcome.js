
app.controller('WelcomeCtrl', function($scope) {
	var theLetters = "abcdefghijklmnopqrstuvwxyz#%&123456789";
	$scope.runHeader = function (phrase) {
		var start = 0;
		var phraseLength = phrase.length;
		var speed = 60; // ms per frame
		var increment = 4; // frames per step. Must be >2
		var randLetterLength = 3;
		var si = 0;
		var stri = 0;
		var block = "";
		var fixed = "";
		//Call self x times, whole function wrapped in setTimeout
		(function rustle(i) {
			setTimeout(function() {
				if (--i) {
					rustle(i);
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
				} else {
					$scope.welcomeHeader = fixed + block;
				}
				block = "";
			});
		}
	};
});
