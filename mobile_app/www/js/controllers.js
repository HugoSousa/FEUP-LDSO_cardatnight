var app = angular.module('controllers', ['highcharts-ng']);

app.controller('NavCtrl', function($scope, $state, $ionicPopup, Restangular) {

    $scope.login = function(){
        $state.go('menu');
    }

    $scope.logout = function(){
        $state.go('login');
    }

    $scope.choosePlace = function(){
        $state.go('places');
    }

    $scope.qrcode = function(){
        $state.go('qrcode');
    }

    $scope.register = function() {
        $state.go('register');
    };

    $scope.goProducts = function(){
        $state.go('products');
    }

    $scope.goProduct = function(id){
        $state.go('product');
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

.controller('RegisterCtrl', function($scope, Restangular){
    $scope.registerSubmit = function(){
        console.log("REGISTO");

        var resource = Restangular.all('register');

        //console.log($scope.user);
        /*
         var example_register = {
             username: "test_restangular5",
             email: "test_restangular@gmail.com",
             name: "test_restangular",
             password: "test"
         }*/

         resource.post($scope.user).then(function(resp) {
            console.log("ok");
         }, function(resp) {
            console.log("error");
             console.log(resp);

             if(resp.status == 409){
                 //name invalid
                 console.log("A");
                 angular.element(document.getElementsByName("username")[0]).parent().addClass('has-error').removeClass('has-success');
             }
             else if(resp.status == 422){
                 //email invalid
                 console.log("B");
                 angular.element(document.getElementsByName("email")[0]).parent().addClass('has-error').removeClass('has-success');
             }

            $scope.error = resp.data.error;

         });

    };
})

.controller('ProductsCtrl', function($scope, $stateParams, Restangular, $ionicLoading) {

    console.log("here");
    $scope.loading = $ionicLoading.show({
        showBackdrop: false
    });

    var products = Restangular.one('products').getList(4).then(function(data){
        $scope.products = data;
        $ionicLoading.hide();
    });
})

.controller('ProductCtrl', function($scope, $stateParams, Restangular, $ionicLoading) {

    $scope.loading = $ionicLoading.show({
        showBackdrop: false
    });

    var product = Restangular.one('product', $stateParams.productId).get().then(function(data){
        $scope.product = data[0];

        $ionicLoading.hide();
    });
})

.controller('OrdersCtrl', function($scope, $stateParams, Orders) {
    $scope.orders = Orders.all();
    $scope.order = Orders.get($stateParams.orderId);
})

.controller('PlacesCtrl', function($scope, $stateParams, Places) {
    $scope.places = Places.all();
    $scope.place = Places.get($stateParams.placeId);
})
