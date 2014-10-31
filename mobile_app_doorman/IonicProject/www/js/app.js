var app = angular.module('starter', ['ionic', 'controllers', 'ngCordova'])

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

app.config(function($stateProvider, $urlRouterProvider) {

   $stateProvider

    .state('scan', {
        url: '/scan',
        templateUrl: 'templates/scan.html',
        controller: 'NavCtrl'
    })

    $urlRouterProvider.otherwise('/scan');

});