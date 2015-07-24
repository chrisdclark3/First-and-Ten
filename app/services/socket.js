app.factory('Socket', function ($rootScope) {
  var socket = io.connect(app.HOST);
  return {
    on: function (event_name, callback) {
      socket.on(event_name, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          callback.apply(socket, args);
        });
      });
    },
    emit: function (event_name, data, callback) {
      socket.emit(event_name, data, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          if (callback) {
            callback.apply(socket, args);
          }
        });
      });
    }
  };
});