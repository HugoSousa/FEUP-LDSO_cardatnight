var app = angular.module('controllers', ['highcharts-ng']);

app.controller('FooterCtrl', function($scope, $state, $ionicPopup) {
    $scope.showFooter = true;

    window.addEventListener('native.keyboardshow', function() {
        $scope.showFooter = false;
        $scope.$apply();
        /*
        $ionicPopup.alert({
            title: 'Keyboard Show',
            template: 'Keyboard Show'
        });
        */
    });

    window.addEventListener('native.keyboardhide', function() {
        $scope.showFooter = true;
        $scope.$apply();
        /*
        $ionicPopup.alert({
            title: 'Keyboard Hide',
            template: 'Keyboard Hide'
        });
        */

    });

})

app.controller('NavCtrl', function($scope, $state, $ionicPopup, AuthService) {


    $scope.loggedUser = AuthService.loggedUser();

	/*
    $scope.login = function(){
        $state.go('menu');
    }
	*/
	
	$scope.menu = function(){
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


.controller('AccountCtrl', function($scope, $state, $stateParams, $ionicPopup, Restangular, AuthService) {

	var loggedUser = AuthService.loggedUser();
	$scope.loggedUser = AuthService.loggedUser().username;
	
	$scope.changePasswordSubmit = function(){
		var resource = Restangular.all('change-password');

		console.log($scope.user);

		if($scope.user.newPassword != $scope.user.newPasswordRetyped)
		{
			var alertPopup = $ionicPopup.alert({
				title: 'Error!',
				template: 'New password and new password retyped dont match!'
			});
			alertPopup.then(function(res) {
				console.log('New password and new password retyped dont match!');
			});
		}
		else{

			resource.post($scope.user).then(function(resp) {
				console.log("ok");
				
				var alertPopup = $ionicPopup.alert({
					 title: 'Change Password',
					 template: 'Password changed successfully!'
				   });
				   alertPopup.then(function(res) {
				   
					 $state.go('login');
						
				   });
				
			}, function(resp) {
				console.log("error");

				$scope.error = resp.data.error;
				
				var alertPopup = $ionicPopup.alert({
					 title: 'Change Password',
					 template: 'Error changing password!'
				   });
				   alertPopup.then(function(res) {
				   
					 
				   });

			});
		
		}
		

	};
	
	$scope.showConfirmDeleteAccount = function() {
        var confirmPopup = $ionicPopup.confirm({
            title: 'Delete Account',
            template: 'Are you sure you want to delete your account?'
        });
        confirmPopup.then(function(res) {
            if(res) {
                console.log('You are sure!');

                var user = {
                    username: loggedUser.username
                }

                var resource = Restangular.all('delete-account');

                resource.post(user).then(function(resp) {
                    console.log("ok");
                    console.log(resp);
					
					var alertPopup = $ionicPopup.alert({
					 title: 'Delete Account',
					 template: 'Account deleted successfully!'
				   });
				   alertPopup.then(function(res) {
				   
					 $state.go('login');
						
				   });
					
                }, function(resp) {
                    console.log("error");
                    console.log(resp);

                    $scope.error = resp.data.error;

                });
            } else {
                console.log('You are not sure');
            }
        });
    };
})

.controller('LoginCtrl', function($scope, $state, Restangular, AuthService, $ionicLoading, $ionicPopup){
    //console.log(AuthService.loggedUser());

    $scope.loginSubmit = function() {
        console.log("Login");

        console.log($scope.user);
        $ionicLoading.show({
            template: 'Logging in...'
        });
        //TODO: encrypt password
        Restangular.all('login').post($scope.user).then(function (resp){
            console.log("ok");
            console.log(resp);

            //window.plugin.notification.local.add({ message: 'Teste notificação.', autoCancel: true });


            var socket = io.connect('http://nightout-app.herokuapp.com:80');

            socket.on('connect', function() {
                console.log("connected");


                socket.emit('storeClientInfo', { username: resp.user.username });

                socket.on('text', function(text) {
                    console.log(text);
                });

                socket.on('notify', function(text) {
                    //popup notification -> bad for usability
                    /*
                    $ionicPopup.alert({
                        title: 'Order Ready',
                        template: '<p style="text-align: center">'+text+'</p>'
                    });
                    */

                    window.plugin.notification.local.add({ message: 'Teste notificação.', autoCancel: true });

                });
            });


            AuthService.login(resp.user, resp.access_token);
            $ionicLoading.hide();
            $state.go('menu');
            //console.log(AuthService.loggedUser());

            //console.log("SENT TOKEN: " +resp.access_token);
            /*
            Restangular.one('testlogin_customer').customGET("", {}, {'x-access-token': resp.access_token}).then(function(response) {
                console.log(response);
            });
            */
        }, function(resp){

            var error = "";
            if(resp.status == 0)
                error = "Please check your Internet connection.";
            else if(resp.status == 401)
                error = resp.data.error;
            else
                error = "Something went wrong.";

            $ionicPopup.alert({
                title: 'Error',
                template: '<p style="text-align: center">'+error+'</p>'
            });

            console.log(resp);
			
			$ionicLoading.hide();
        });
    };

})


.controller('RegisterCtrl', function($scope, Restangular, $ionicLoading, AlertPopupService){
	$scope.attempt = false;
	$scope.invalid_email = false;
	$scope.invalid_username = false;


    $scope.registerSubmit = function(){
		$ionicLoading.show({
			template: 'Signing up...'
		});
        var resource = Restangular.all('register');

         resource.post($scope.user).then(function(resp) {
            //console.log(resp.data);
			$ionicLoading.hide();
			$scope.logout();
         }, function(resp) {
		 
			$scope.attempt = true;
             console.log(resp);

             if(resp.status == 409){
                 //name invalid
				$scope.invalid_username = true;
				$scope.user.username = '';

             }
             else if(resp.status == 422){
                 //email invalid
				 if (resp.data.error.indexOf("Email") != -1) {
				 			$scope.invalid_email = true;
							$scope.user.email = '';
				 } else if (resp.data.error.indexOf("Username") != -1) {
				$scope.invalid_username = true;
				$scope.user.username = '';
				}
				
             }
			AlertPopupService.createPopup("Error", resp.data.error);
            $ionicLoading.hide();

         });

    };
})

.controller('ProductsCtrl', function($scope, $stateParams, Restangular, $ionicLoading) {

    $ionicLoading.show({
        template: '',
        showBackdrop: false
    });

    //hardcoded establishment id=4
    var products = Restangular.one('products').getList(4).then(function(data){
        $scope.products = data;

        $ionicLoading.hide();
    });
})

.controller('ProductCtrl', function($state, $scope, $stateParams, $ionicPopup, Restangular, $ionicLoading) {

    $ionicLoading.show({
        showBackdrop: false
    });

    var product = Restangular.one('product', $stateParams.productId).get().then(function(data){
        $scope.product = data[0];

        $ionicLoading.hide();
    });

	
	$scope.orderSubmit = function(){



        $ionicPopup.show({

            template: '<div counter value="orderData.quantity" min="1" max="5" step="1"></div>',
            title: 'Choose the Quantity',
            scope: $scope,
            buttons: [
                { text: 'Cancel' },
                {
                    text: '<b>Ok</b>',
                    type: 'button-positive',
                    onTap: function(e) {
                        console.log($scope.orderData);
                        orderProduct();
                    }
                }
            ]
        });
		
		console.log($scope.orderData);


		var orderProduct = function(){

            console.log("ordering product");
            console.log($scope.orderData);

            var resource = Restangular.all('order');

            resource.post($scope.orderData).then(function(resp) {
                console.log("ok");
                console.log(resp);

                var alertPopup = $ionicPopup.alert({
                 title: 'Order',
                 template: "<p style='text-align:center'>Order made successfully!</p>"
               });
               alertPopup.then(function(res) {

                 $state.go('products');

               });

            }, function(resp) {
                console.log("error");
                console.log(resp);
                var error = "";
                if(resp.status == 0)
                    error = "Service unavailable.<br>Please try again later.";
                else
                    error = "An error occurred.<br> Please try again later.";


                var alertPopup = $ionicPopup.alert({
                 title: 'Order',
                 template: "<p style='text-align:center'>"+error+"</p>"
               });
               alertPopup.then(function(res) {
               });

            });
        }

	};
})

.controller('OrdersCtrl', function($scope, Restangular) {
    //$scope.orders = Orders.all();

    //get active cart (could be stored in a variable instead of asking the server every time)
    //get orders from that cart (hardcoded cartid=6)
    Restangular.one('actualorders').getList(1).then(function(data){
        $scope.orders = data;
        //console.log($scope.orders.ordersid);
    });
    //$scope.order = Orders.get($stateParams.orderId);
})

.controller('PlacesCtrl', function($scope, $stateParams, Places) {
    $scope.places = Places.all();
    $scope.place = Places.get($stateParams.placeId);
})