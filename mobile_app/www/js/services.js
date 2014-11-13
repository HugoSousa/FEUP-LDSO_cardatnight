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
    var localStorageUser = $window.localStorage['user'];
    if (localStorageUser && localStorageUser != '' && localStorageUser != 'undefined' && typeof localStorageUser != 'undefined') loggedUser = JSON.parse(localStorageUser);
      
    return{ 
        login: function(user, access_token) {
            if (user && access_token) {
                loggedUser = user;
                loggedUser.access_token = access_token;
                if (loggedUser) $window.localStorage['user'] = JSON.stringify(loggedUser);
            }
        },
        logout: function() {
            loggedUser = '';
            $window.localStorage['user'] = '';
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

app.factory('PlacesService', function(){

    //fake places
    var places = [
        { id: 0, name: 'Discoteca X'},
        { id: 1, name: 'Y Club'},
        { id: 2, name: 'Bar Z'}
    ];

    return {
        all: function() {
            return places;
        },
        get: function(placeId) {
            // Simple index lookup
            return places[placeId];
        }
    }
})

app.factory('FooterService', function(){

    var showFooter = true;

    return {

        changeFooter: function(show) {
            showFooter = show;
        },
        showFooter: function() {
            return showFooter;
        }
    }
})

app.factory('SocketService', function(){

    var socket;

    return {

        getSocket: function() {
            return socket;
        },
        setSocket: function(s) {
            socket = s;
        }
    }
})