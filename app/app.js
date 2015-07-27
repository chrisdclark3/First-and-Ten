app = angular.module('app', [ 'ngResource', 'ngSanitize','ui.bootstrap','ngFacebook', 'ngRoute', 'LocalStorageModule']);

app.constant('HOST', 'http://localhost:6789');
app.constant('fbConfigSettings', { 'appID':'1662976117248382' });

app.config(['$httpProvider', function ($httpProvider) {
  $httpProvider.defaults.useXDomain = true;
  delete $httpProvider.defaults.headers.common['X-Requested-With'];
}]);

app.config(function ($facebookProvider) {
  $facebookProvider.setAppId('1662976117248382');
});

// ------------------------ROUTES------------------------ //

app.config(['$routeProvider', function ($routeProvider) {
  $routeProvider
  .when('/home', {
    templateUrl: 'views/home.html',
  })
  .when('/rooms', {
    templateUrl: 'views/rooms.html',
  })
  .when('/room', {
    templateUrl: 'views/room.html',
  })
  .otherwise({
    redirectTo: '/home'
  });
}]);

app.run(['$rootScope', '$window', function ($rootScope, $window) {
   (function(){
     // If we've already installed the SDK, we're done
     if (document.getElementById('facebook-jssdk')) {return;}

     // Get the first script element, which we'll use to find the parent node
     var firstScriptElement = document.getElementsByTagName('script')[0];

     // Create a new script element and set its id
     var facebookJS = document.createElement('script');
     facebookJS.id = 'facebook-jssdk';

     // Set the new script's source to the source of the Facebook JS SDK
     facebookJS.src = '//connect.facebook.net/en_US/all.js';

     // Insert the Facebook JS SDK into the DOM
     firstScriptElement.parentNode.insertBefore(facebookJS, firstScriptElement);
   }());
}]);