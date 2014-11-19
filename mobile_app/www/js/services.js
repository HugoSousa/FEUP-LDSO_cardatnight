var app = angular.module('services', [])

app.factory('AuthService', ['$window', function($window){

    var loggedUser;
    var localStorageUser = $window.localStorage['user'];
    if (localStorageUser && localStorageUser != '' && localStorageUser != 'undefined' && typeof localStorageUser != 'undefined') loggedUser = JSON.parse(localStorageUser);
      
    return{ 
        login: function(user, access_token) {
            if (user && access_token) {
                loggedUser = user;
                loggedUser.access_token = access_token;
                //HARDCODED CART ID = 1
                loggedUser.cartid = 1;
                if (loggedUser)
                    $window.localStorage['user'] = JSON.stringify(loggedUser);
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
        },
        setEstablishment: function(establishmentname){
            loggedUser.establishmentname = establishmentname;
        },
    }

}]);

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

app.factory('SocketService', ['$window', '$state', function($window, $state){

    var socket;

    return {

        getSocket: function() {
            return socket;
        },
        setSocket: function(s){
            socket = s;
        },
        connectSocket: function(user) {
            socket = io.connect('http://nightout-app.herokuapp.com:80', {'force new connection': true});
            //socket = io.connect('http://localhost:1337', {'force new connection': true});

            //$window.localStorage['socket'] = JSON.stringify(socket.io.engine.id);

            socket.on('connect', function() {
                console.log("connected");
                console.log("ID: " + socket.io.engine.id);
                $window.localStorage['socket'] = socket.io.engine.id;

                if(window.plugin && window.plugin.notification.local) {
                    window.plugin.notification.local.onclick = function (id, state, json) {

                        $state.go("order-detail", {orderId: JSON.parse(json).orderid}, {reload: true});

                        $window.localStorage['redirect'] = JSON.parse(json).orderid;



                    };
                }

                socket.emit('storeClientInfo', { username: user });

                socket.on('text', function(text) {
                    console.log(text);
                });

                socket.on('notify', function(text) {
                    console.log("NOTIFICAÇÃO");

                    window.plugin.notification.local.add({
                        id: "1",
                        message: 'Your order just got ready. Please check your secret code and go get it.',
                        autoCancel: true,
                        json: JSON.stringify({ orderid: text })
                    });



                    /*
                     window.plugin.notification.local.onclick = function (id, state, json) {
                         $window.localStorage['redirect'] = "orders";
                         $state.go("orders");
                         $ionicPopup.alert({
                         title: 'Notification ' + id + ' clicked' + state,
                         template: JSON.parse(json).order + " was ordered"
                         });

                     };
                    */
                });
            });
        },
        removeOld: function(socketId){
            console.log("REMOVE OLD: " + socketId);
            socket.emit("removeClientInfo", {socketid: socketId});
        },
        disconnect: function(){
            socket.disconnect();
            $window.localStorage['socket'] = '';
        }

    }
}])