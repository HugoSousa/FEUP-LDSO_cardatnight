var app = angular.module('starter', ['controllers', 'services', 'restangular','ui.router','ui.bootstrap','ui.unique']);

app.run(function() {

})



app.config(function($stateProvider, $urlRouterProvider, RestangularProvider) {

    //RestangularProvider.setBaseUrl('http://localhost:1337');
    RestangularProvider.setBaseUrl('https://nightout-app.herokuapp.com');

    RestangularProvider.setDefaultHttpFields({timeout: 10000}); // set timeout of 10 seconds


    $stateProvider

        .state('login', {
            url: '/login',
            templateUrl: 'login.html'
        })

		.state('products', {
            url: '/products',
            views: {
                // the main template will be placed here (relatively named)
                '': { templateUrl: 'card@night.html' },

                // the child views will be defined here (absolutely named)
                'content@products': {
                    templateUrl: 'templates/products.html',
                    controller:	'ProductsCtrl'
                }
            }
        })
		
		.state('product-detail', {
            url: '/product/:productId',
            views: {
                // the main template will be placed here (relatively named)
                '': { templateUrl: 'card@night.html' },

                // the child views will be defined here (absolutely named)
                'content@product-detail': {
                    templateUrl: 'templates/product-detail.html',
                    controller: 'ProductCtrl'
                }
            }
        })

        .state('incoming-orders', {
            url: '/incoming-orders',
            views: {

                // the main template will be placed here (relatively named)
                '': { templateUrl: 'card@night.html' },

                // the child views will be defined here (absolutely named)
                'content@incoming-orders': { 
                    templateUrl: 'templates/incoming-orders.html',
                    controller: 'IncomingOrdersCtrl'
            }

            }
        })
		
		.state('customers', {
            url: '/customers',
			views: {
                // the main template will be placed here (relatively named)
                '': { templateUrl: 'card@night.html' },

                // the child views will be defined here (absolutely named)
                'content@customers': {
                    templateUrl: 'templates/customers.html',
					controller: 'CustomersCtrl'
                }
        }})

        

    $urlRouterProvider.otherwise('/login');

});