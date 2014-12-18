var app = angular.module('services', [])


app.factory('AuthService',['$window', function($window){

    var loggedUser;

    return{
        login: function(user, access_token) {
            if (user && access_token) {
                loggedUser = user;
                loggedUser.access_token = access_token;
				
				if (loggedUser)
                    $window.localStorage['user'] = JSON.stringify(loggedUser);
            }
        },
        loggedUser: function(){
            return JSON.parse($window.localStorage['user']);
        },
		 logout: function() {
            loggedUser = '';
            $window.localStorage['user'] = '';
        },
        token: function(){
            //console.log("return token");
            if (loggedUser)
                return loggedUser.access_token;
            else
                return null;
        }
    }

}]);

app.factory('alertService', ['$rootScope', function($rootScope) {
    var alertService;
    $rootScope.alerts = [];
    return alertService = {
      add: function(type, msg) {
        return $rootScope.alerts.push({
          type: type,
          msg: msg,
          close: function() {
            return alertService.closeAlert(this);
          }
        });
      },
      closeAlert: function(alert) {
        return this.closeAlertIdx($rootScope.alerts.indexOf(alert));
      },
      closeAlertIdx: function(index) {
        return $rootScope.alerts.splice(index, 1);
      },
      clear: function(){
        $rootScope.alerts = [];
      }
    };
  }
]);

app.factory('SocketService', ['$window', function($window){

    var socket;

    return {
        getSocket: function(){
            return socket;
        },
        connectSocket: function(establishment) {
            //socket = io.connect('http://nightout-app.herokuapp.com:80', {'force new connection': true});
            socket = io.connect('http://localhost:1337', {'force new connection': true});

            socket.on('connect', function() {
                console.log("connected");

                socket.emit('storeManagerEmployeeInfo', { establishmentid: establishment });
            });
        },
        disconnect: function(){
            socket.disconnect();
        }

    }
}])
