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