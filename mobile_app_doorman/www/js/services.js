var app = angular.module('services', [])

/*
app.factory('SplashService', function($q, $timeout){

    return{
        done: function () {
            var deferred = $q.defer();

            $timeout(function() {
                deferred.resolve();
            }, 20000);

            return deferred.promise;
        }
    }

});
*/
app.factory('AuthService', ['$window', function($window){

    var loggedUser;
    var localStorageUser = $window.localStorage['doorman'];
    if (localStorageUser && localStorageUser != '' && localStorageUser != 'undefined' && typeof localStorageUser != 'undefined') loggedUser = JSON.parse(localStorageUser);
      
    return{ 
        login: function(user, access_token) {
            if (user && access_token) {
                loggedUser = user;
                loggedUser.access_token = access_token;
                if (loggedUser) $window.localStorage['doorman'] = JSON.stringify(loggedUser);
            }
        },
        logout: function() {
            loggedUser = '';
            $window.localStorage['doorman'] = '';
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

}]);