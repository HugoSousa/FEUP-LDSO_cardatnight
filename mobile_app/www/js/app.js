var app = angular.module('starter', ['ionic', 'controllers', 'services']);

app.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
        /*
        if(window.StatusBar) {
            StatusBar.styleDefault();
        }
        */
    });
})

app.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider

        .state('login', {
            url: '/login',
            templateUrl: 'templates/login.html',
            controller: 'NavCtrl'
        })

        .state('register', {
            url: '/register',
            templateUrl: 'templates/register.html',
            controller: 'NavCtrl'
        })

        .state('account', {
            url: '/account',
            templateUrl: 'templates/account.html',
            controller: 'NavCtrl'
        })

        .state('account-change-password', {
            url: '/account-change-password',
            templateUrl: 'templates/account-change-password.html',
            controller: 'NavCtrl'
        })

        .state('account-delete', {
            url: '/account-delete',
            templateUrl: 'templates/account-delete.html',
            controller: 'NavCtrl'
        })

        .state('forgot-password', {
            url: '/forgot-password',
            templateUrl: 'templates/forgot-password.html',
            controller: 'NavCtrl'
        })

        .state('menu', {
            url: '/menu',
            templateUrl: 'templates/menu.html',
            controller: 'NavCtrl'
        })

        .state('products', {
            url: '/products',
            templateUrl: 'templates/products.html',
            controller: 'ProductsCtrl'
        })

        .state('product-detail', {
            url: '/product/:productId',
            templateUrl: 'templates/product-detail.html',
            controller: 'ProductsCtrl'
        })

        .state('orders', {
            url: '/orders',
            templateUrl: 'templates/orders.html',
            controller: 'OrdersCtrl'
        })

        .state('order-detail', {
            url: '/order/:orderId',
            templateUrl: 'templates/order-detail.html',
            controller: 'OrdersCtrl'
        })

        .state('places', {
            url: '/places',
            templateUrl: 'templates/places.html',
            controller: 'PlacesCtrl'
        })

        .state('place-detail', {
            url: '/place/:placeId',
            templateUrl: 'templates/place-detail.html',
            controller: 'PlacesCtrl'
        })

        .state('history', {
            url: '/history',
            templateUrl: 'templates/history.html',
            controller: 'PlacesCtrl'
        })

        .state('qrcode', {
            url: '/qrcode',
            templateUrl: 'templates/qrcode.html',
            controller: 'NavCtrl'
        })

    $urlRouterProvider.otherwise('/login');

});