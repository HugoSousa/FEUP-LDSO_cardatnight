var app = angular.module('starter', ['ionic', 'controllers', 'services', 'ngCordova', 'restangular', 'ui.unique'])

.run(function($ionicPlatform)
{
  $ionicPlatform.ready(function()
  {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

app.config(function($stateProvider, $urlRouterProvider, RestangularProvider) {

    //RestangularProvider.setBaseUrl('http://localhost:1337');
    RestangularProvider.setBaseUrl('https://nightout-app.herokuapp.com');

    RestangularProvider.setDefaultHttpFields({timeout: 10000}); // set timeout of 5 seconds

   $stateProvider
   
   .state('login', {
        url: '/login',
        templateUrl: 'templates/login.html',
        controller: 'NavCtrl'
    })

    .state('scan', {
        url: '/scan',
        templateUrl: 'templates/scan.html',
        controller: 'NavCtrl'
    })

    $urlRouterProvider.otherwise('/login');

});