var app = angular.module('controllers', ['highcharts-ng']);

app.controller('NavCtrl', function($scope, $state, $ionicPopup) {
    $scope.login = function(){
        $state.go('menu');
    }

    $scope.register = function() {
        $state.go('register');
    };

    $scope.goProducts = function(){
        $state.go('products');
    }

    $scope.goOrders = function(){
        $state.go('orders');
    }

    $scope.goHistory = function(){
        $state.go('history');
    }

    $scope.goAccount = function(){
        $state.go('account');
    }

    $scope.changePassword = function() {
        $state.go('account-change-password');
    };

    $scope.showConfirmDeleteAccount = function() {
        var confirmPopup = $ionicPopup.confirm({
            title: 'Delete Account',
            template: 'Are you sure you want to delete your account?'
        });
        confirmPopup.then(function(res) {
            if(res) {
                console.log('You are sure');
            } else {
                console.log('You are not sure');
            }
        });
    };

    $scope.forgotPassword = function() {
        $state.go('forgot-password');
    };

    $scope.chartConfig = {
        options: {
            chart: {
                type: 'line',
                zoomType: 'x'
            },
            plotOptions: {
                series: {
                    cursor: 'pointer',
                    point: {
                        events: {
                            click: function (e) {
                                console.log("Click");
                            }
                        }
                    },
                    marker: {
                        lineWidth: 1
                    }
                }
            }

        },
        series: [{
            data: [10, 15, 12, 8, 7, 1, 1, 19, 15, 10]
        }],
        title: {
            text: 'Test'
        },
        xAxis: {currentMin: 0, currentMax: 10, minRange: 1},
        loading: false
    }
})

.controller('ProductsCtrl', function($scope, $stateParams, Products) {
    $scope.products = Products.all();
    $scope.product = Products.get($stateParams.productId);
})

.controller('OrdersCtrl', function($scope, $stateParams, Orders) {
    $scope.orders = Orders.all();
    $scope.order = Orders.get($stateParams.orderId);
})

.controller('PlacesCtrl', function($scope, $stateParams, Places) {
    $scope.places = Places.all();
})
