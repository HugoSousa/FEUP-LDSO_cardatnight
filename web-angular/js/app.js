var app = angular.module('starter', ['controllers', 'services', 'restangular','ui.router','ui.bootstrap','ui.unique']);

app.run(function() {

})



app.config(function($stateProvider, $urlRouterProvider, RestangularProvider) {

   RestangularProvider.setBaseUrl('http://localhost:1337');
   //RestangularProvider.setBaseUrl('https://nightout-app.herokuapp.com');

    RestangularProvider.setDefaultHttpFields({timeout: 10000}); // set timeout of 10 seconds


    $stateProvider

        .state('login', {
            url: '/login',
            templateUrl: 'templates/login.html',
			controller:	'LoginCtrl'
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
		
		.state('product-add', {
            url: '/product-add',
            views: {
                // the main template will be placed here (relatively named)
                '': { templateUrl: 'card@night.html' },

                // the child views will be defined here (absolutely named)
                'content@product-add': {
                    templateUrl: 'templates/product-add.html',
                    controller:	'ProductAdd'
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
            url: '/customers/:estabid',
            views: {
                // the main template will be placed here (relatively named)
                '': { templateUrl: 'card@night.html' },

                // the child views will be defined here (absolutely named)
                'content@customers': {
                    templateUrl: 'templates/customers.html',
                    controller: 'CustomersCtrl'
                }
        }})
        .state('customer', {
            url: '/customer/:cartid',
            views: {
                // the main template will be placed here (relatively named)
                '': { templateUrl: 'card@night.html' },

                // the child views will be defined here (absolutely named)
                'content@customer': {
                    templateUrl: 'templates/customer.html',
                    controller: 'CustomerCtrl'
                }
        }})

        .state('logout', {
            onEnter: function(SocketService, $window) {
                console.log("disconnect");
                SocketService.disconnect();
            },
            controller: function($state) {
                $state.go('login');
            }
        })

    $urlRouterProvider.otherwise('/login');

});