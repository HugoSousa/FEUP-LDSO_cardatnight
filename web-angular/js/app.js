var app = angular.module('starter', ['controllers', 'services', 'restangular','ui.router','ui.bootstrap']);

app.run(function() {

})



app.config(function($stateProvider, $urlRouterProvider, RestangularProvider) {

    //RestangularProvider.setBaseUrl('http://localhost:1337');
    RestangularProvider.setBaseUrl('https://nightout-app.herokuapp.com');

    RestangularProvider.setDefaultHttpFields({timeout: 10000}); // set timeout of 10 seconds


    $stateProvider

		.state('products', {
            url: '/products',
            templateUrl: 'templates/products.html',
			controller:	'ProductsCtrl'
        })
		
		.state('product-detail', {
            url: '/product/:productId',
            templateUrl: 'templates/product-detail.html',
            controller: 'ProductCtrl'
        })

        .state('incoming-orders', {
            url: '/incoming-orders',
            templateUrl: 'templates/incoming-orders.html',
            controller: 'IncomingOrdersCtrl'
        })
		
		.state('customers', {
            url: '/customers',
            templateUrl: 'templates/customers.html',
			controller: 'CustomersCtrl'
        })

        

    $urlRouterProvider.otherwise('/incoming-orders');

});