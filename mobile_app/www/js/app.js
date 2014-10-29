var app = angular.module('starter', ['ionic', 'controllers', 'services', 'restangular', 'ui.unique']);

app.run(function($ionicPlatform) {

    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if(window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.disableScroll(true);
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if(window.StatusBar) {
            // Set the statusbar to use the default style, tweak this to
            // remove the status bar on iOS or change it to use white instead of dark colors.
            StatusBar.styleDefault();
        }
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


app.service('StateManager', ['$state', '$stateParams', '$rootScope', function($state, $stateParams, $rootScope)
{
    this.go = function(state, params, options)
    {
        var destroyListener = $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams)
        {
            angular.extend( toParams, params);
            destroyListener();
        });

        return $state.go(state, params, options);
    };
}])


app.config(function($stateProvider, $urlRouterProvider, RestangularProvider) {

   RestangularProvider.setBaseUrl('http://localhost:1337');
   //RestangularProvider.setBaseUrl('https://nightout-app.herokuapp.com');

    RestangularProvider.setDefaultHttpFields({timeout: 10000}); // set timeout of 5 seconds


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


// http://jsbin.com/busuvu/2/edit?html,js,output
app.directive("counter", function() {
    return {
        restrict: "A",
        scope: {
            value: "=value"
        },
        template: "<div class=\"input-group\"><span class=\"input-group-btn\" ng-click=\"minus()\"><button class=\"btn btn-default\"><span class=\"glyphicon glyphicon-minus\"></span></button></span><input type=\"text\" class=\"form-control text-center\" ng-value=\"scope\" ng-model=\"value\" ng-change=\"changed()\" disabled><span class=\"input-group-btn\" ng-click=\"plus()\"><button class=\"btn btn-default\"><span class=\"glyphicon glyphicon-plus\"></span></button></span></div>",
        link: function(scope, element, attributes) {
            var max, min, setValue, step;
            max = void 0;
            min = void 0;
            setValue = void 0;
            step = void 0;
            if (angular.isUndefined(scope.value)) {
                throw "Missing the value attribute on the counter directive.";
            }
            min = (angular.isUndefined(attributes.min) ? null : parseInt(attributes.min));
            max = (angular.isUndefined(attributes.max) ? null : parseInt(attributes.max));
            step = (angular.isUndefined(attributes.step) ? 1 : parseInt(attributes.step));
            element.addClass("counter-container");
            scope.readonly = (angular.isUndefined(attributes.editable) ? true : false);

            /**
             Sets the value as an integer.
             */
            setValue = function(val) {
                scope.value = parseInt(val);
            };
            setValue(scope.value);

            /**
             Decrement the value and make sure we stay within the limits, if defined.
             */
            scope.minus = function() {
                if (min && (scope.value <= min || scope.value - step <= min) || min === 0 && scope.value < 1) {
                    setValue(min);
                    return false;
                }
                setValue(scope.value - step);
            };

            /**
             Increment the value and make sure we stay within the limits, if defined.
             */
            scope.plus = function() {
                if (max && (scope.value >= max || scope.value + step >= max)) {
                    setValue(max);
                    return false;
                }
                setValue(scope.value + step);
            };

            /**
             This is only triggered when the field is manually edited by the user.
             Where we can perform some validation and make sure that they enter the
             correct values from within the restrictions.
             */
            scope.changed = function() {
                if (!scope.value) {
                    setValue(0);
                }
                if (/[0-9]/.test(scope.value)) {
                    setValue(scope.value);
                } else {
                    setValue(scope.min);
                }
                if (min && (scope.value <= min || scope.value - step <= min)) {
                    setValue(min);
                    return false;
                }
                if (max && (scope.value >= max || scope.value + step >= max)) {
                    setValue(max);
                    return false;
                }
                setValue(scope.value);
            };
        }
    };
});

