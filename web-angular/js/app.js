var app = angular.module('starter', ['controllers', 'services', 'restangular','ui.router','ui.bootstrap']);

app.run(function() {

})



app.config(function($stateProvider, $urlRouterProvider, RestangularProvider) {

    RestangularProvider.setBaseUrl('http://localhost:1337');
    //RestangularProvider.setBaseUrl('https://nightout-app.herokuapp.com');

    RestangularProvider.setDefaultHttpFields({timeout: 10000}); // set timeout of 10 seconds


    $stateProvider

        .state('login', {
            url: '/login',
            templateUrl: 'templates/login.html'
        })

        .state('incoming-orders', {
            url: '/incoming-orders',
            templateUrl: 'templates/incoming-orders.html',
            controller: 'IncomingOrdersCtrl'
        })

        

    $urlRouterProvider.otherwise('/login');

});