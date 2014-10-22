var app = angular.module('starter', ['ionic', 'controllers', 'services', 'restangular']);

app.run(function($ionicPlatform) {

    $ionicPlatform.ready(function() {
        /*
        if(window.StatusBar) {
            StatusBar.styleDefault();
        }
        */
    });
})

app.service('AlertPopupService', ['$ionicPopup', function ($ionicPopup) {

        this.createPopup = function (headerMessage, bodyMessage, okAction) {
            $ionicPopup.alert({
                title: headerMessage,
                content: bodyMessage
            }).then(function (res) {
                if (okAction)
                    okAction();
            });
        }
    }])

app.config(function($stateProvider, $urlRouterProvider, RestangularProvider) {

   // RestangularProvider.setBaseUrl('http://localhost:1337');
   RestangularProvider.setBaseUrl('https://nightout-app.herokuapp.com');

    // RestangularProvider.setDefaultHeaders({'x-access-token': AuthServiceProvider.token()});

    /*
    RestangularProvider.addFullRequestInterceptor(function (element, operation, what, url, headers) {
        return {
            headers: _.extend(headers, {'x-access-token': AuthServiceProvider.token()})
        }
    });*/

    RestangularProvider.setDefaultHttpFields({timeout: 5000}); // set timeout of 5 seconds


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
            controller: 'ProductCtrl'
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

app.directive('onValidSubmit', ['$parse', '$timeout', function($parse, $timeout) {
    return {
        require: '^form',
        restrict: 'A',
        link: function(scope, element, attrs, form) {
            form.$submitted = false;
            var fn = $parse(attrs.onValidSubmit);
            element.on('submit', function(event) {
                scope.$apply(function() {
                    element.addClass('ng-submitted');
                    form.$submitted = true;
                    if (form.$valid) {
                        if (typeof fn === 'function') {
                            fn(scope, {$event: event});
                        }
                    }
                });
            });
        }
    }

}])

app.directive('validated', ['$parse', function($parse) {
    return {
        restrict: 'AEC',
        require: '^form',
        link: function(scope, element, attrs, form) {
            var inputs = element.find("*");
            for(var i = 0; i < inputs.length; i++) {
                (function(input){
                    var attributes = input.attributes;
                    if (attributes.getNamedItem('ng-model') != void 0 && attributes.getNamedItem('name') != void 0) {
                        var field = form[attributes.name.value];
                        if (field != void 0) {
                            scope.$watch(function() {
                                return form.$submitted + "_" + field.$valid;
                            }, function() {
                                if (form.$submitted != true) return;
                                var inp = angular.element(input);
                                if (inp.hasClass('ng-invalid')) {
                                    element.removeClass('has-success');
                                    element.addClass('has-error');
                                } else {
                                    element.removeClass('has-error').addClass('has-success');
                                }
                            });
                        }
                    }
                })(inputs[i]);
            }
        }
    }
}])

