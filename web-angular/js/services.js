var app = angular.module('services', [])


app.factory('AuthService', function(){

    var loggedUser;

    return{
        login: function(user, access_token) {
            if (user && access_token) {
                loggedUser = user;
                loggedUser.access_token = access_token;
            }
        },
        loggedUser: function(){
            return loggedUser;
        },
        token: function(){
            //console.log("return token");
            if (loggedUser)
                return loggedUser.access_token;
            else
                return null;
        }
    }

});

app.factory('alertService', [
      '$rootScope', function($rootScope) {
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
