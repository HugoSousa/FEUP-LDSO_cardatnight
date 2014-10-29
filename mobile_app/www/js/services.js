var app = angular.module('services', [])


app.factory('AuthService', ['$window', function($window){
   
    var loggedUser;
     
    loggedUser = JSON.parse($window.localStorage['user']);
     
    return{
        login: function(user, access_token) {
            if (user && access_token) {
                loggedUser = user;
                loggedUser.access_token = access_token;
                $window.localStorage['user'] = JSON.stringify(loggedUser);
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

}]);

app.factory('Places', function(){

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