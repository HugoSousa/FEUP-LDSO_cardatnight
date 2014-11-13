var app = angular.module('controllers', ['highcharts-ng']);

app.controller('FooterCtrl', ["$scope", "FooterService", function($scope, FooterService) {

    $scope.showFooter = FooterService;

    window.addEventListener('native.keyboardshow', function() {
        FooterService.changeFooter(false);
        $scope.$apply();
        /*
        $ionicPopup.alert({
            title: 'Keyboard Show',
            template: 'Keyboard Show'
        });
        */ 
    });

    window.addEventListener('native.keyboardhide', function() {
        FooterService.changeFooter(true);
        $scope.$apply();
        /*
        $ionicPopup.alert({
            title: 'Keyboard Hide',
            template: 'Keyboard Hide'
        });
        */

    });

}]);

app.controller('NavCtrl', function($scope, $state, $ionicPopup, AuthService) {
    /*

    if(window.plugin && window.plugin.notification.local){
        window.plugin.notification.local.onclick = function (id, state, json) {
            $state.go("orders");
            $ionicPopup.alert({
                title: 'Notification ' + id + ' clicked',
                template: JSON.parse(json).order + " was ordered"
            });

        };
    }
*/
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


.controller('AccountCtrl', function($scope, $state, $stateParams, $ionicPopup, Restangular, AuthService, SocketService) {

	var loggedUser = AuthService.loggedUser();
	$scope.loggedUser = AuthService.loggedUser().username;
	
        
    $scope.logout = function() {

        AuthService.logout();
        SocketService.getSocket().disconnect();
        $state.go('login');
    }
    
    
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

.controller('LoginCtrl', function($scope, $state, $stateParams, Restangular, AuthService, $ionicLoading, $ionicPopup, $ionicViewService, SocketService){
    //console.log(AuthService.loggedUser())
    console.log("LOGIN CONTROLLER");
    $ionicViewService.clearHistory();

    $scope.loginSubmit = function() {
        console.log("Login");
        var bitArray = sjcl.hash.sha256.hash($scope.user.password);
        var digest_sha256 = sjcl.codec.hex.fromBits(bitArray);

        
        console.log($scope.user);
        $ionicLoading.show({
            template: 'Logging in...'
        });
        //TODO: encrypt password
        Restangular.all('login').post({username: $scope.user.username, password: digest_sha256} ).then(function (resp){
            console.log("ok");
            console.log(resp);

            if(window.plugin && window.plugin.notification.local) {
                window.plugin.notification.local.onclick = function (id, state, json) {
                    $state.go("orders");
                    $ionicPopup.alert({
                        title: 'Notification ' + id + ' clicked' + state,
                        template: JSON.parse(json).order + " was ordered"
                    });

                };
            }

            console.log("CONNECT SOCKET");

            SocketService.connectSocket(resp.user.username);
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


.controller('MenuCtrl', function($scope, $state, Restangular, AuthService, $ionicLoading, $ionicViewService ){
    //console.log(AuthService.loggedUser());
    console.log(AuthService.token());
    $scope.hasCart;
    $ionicLoading.show({
        template: 'Loading...'
    });
    Restangular.all('getcart').customGET("", {}, {'x-access-token': AuthService.token()}).then(function(data){
        $ionicLoading.hide();
        if(data.status == "valid"){
            $scope.balance = data.cart.balance;
            $scope.hasCart = true;
        }else{
            $scope.hasCart = false;
        }
    }, function(resp) {
        $ionicLoading.hide();
        console.log("FAIL");
    });

     $ionicViewService.clearHistory();
})


.controller('RegisterCtrl', function($scope, $state, Restangular, $ionicLoading, AlertPopupService, StateManager){
	$scope.invalid_email = false;
	$scope.invalid_username = false;
    $scope.user = {username: '', name: '', email: '', password: ''};
    var EMAIL_REGEXP = /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i;
    
    $scope.validateName = function(name) {
        if (name) {
            if (name.length >= 1 && name.length <= 50) 
                return 'has-success';
            else return 'has-error';
        }
        else return '';
    }
        
    $scope.validateEmail = function(email) {
        if (email) {
            if ($scope.invalid_email == email) return 'has-warning';
            if (EMAIL_REGEXP.test(email)) {
                return 'has-success';
            } else return 'has-error'; 
           
        }
        else return '';
    }
    
        $scope.validateUsername = function(user) {
        if (user) {
        if ($scope.invalid_username == user) return 'has-warning';

            console.log(user.length);
            if (user.length >= 3 && user.length <= 25 && !(user.indexOf(' ') > -1)) 
                return 'has-success';
            else return 'has-error';
           
        }
        else return '';
    }
    
    $scope.validatePassword = function(password) {
        if (password) {
            console.log(password.length);
            if (password.length >= 3 && password.length <= 50 && !(password.indexOf(' ') > -1)) 
                return 'has-success';
            else return 'has-error';
           
        }
        else return '';
    }
    
        $scope.validateUser = function(user) {
            return $scope.validateName(user.name) == 'has-success' &&
                    $scope.validateEmail(user.email)  == 'has-success'&& 
                    $scope.validateUsername(user.username)  == 'has-success'&&    
                    $scope.validatePassword(user.password)  == 'has-success';
        }
    
    $scope.registerSubmit = function(){
		$ionicLoading.show({
			template: 'Signing up...'
		});
        var resource = Restangular.all('register');
        
        var bitArray = sjcl.hash.sha256.hash($scope.user.password);
        var digest_sha256 = sjcl.codec.hex.fromBits(bitArray);

        var send_user = 
        { username: $scope.user.username,
        name: $scope.user.name,
        email: $scope.user.email,
        password: digest_sha256
        }
         resource.post(send_user).then(function(resp) {
            //console.log(resp.data);
			$ionicLoading.hide();
            AlertPopupService.createPopup("Registration successfully complete!", "Welcome " + $scope.user.name,  function() {
            	 StateManager.go('login', { username: $scope.user.username });
            });

         }, function(resp) {
		 
             console.log(resp);

             if(resp.status == 409){
                 //name invalid
                    if (resp.data.error.indexOf("Email") != -1) 
                    {
                    $scope.invalid_email = $scope.user.email;
                  }
                  else if (resp.data.error.indexOf("Username") != -1) {
                    $scope.invalid_username =  $scope.user.username;
                }
             }
             else if(resp.status == 422){
                 //email invalid
				 if (resp.data.error.indexOf("Email") != -1) {
				 			$scope.invalid_email = $scope.user.email;
				 } else if (resp.data.error.indexOf("Username") != -1) {
				$scope.invalid_username = $scope.user.username;
				}
				
             }
			AlertPopupService.createPopup("Error", resp.data.error);
            $ionicLoading.hide();

         });

    };
})

.controller('ProductsCtrl', function($scope, $stateParams, Restangular, $ionicLoading) {

    $scope.orderByField = 'name';
    $scope.reverseSort = false;

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

            template: '<div counter  value="orderData.quantity" min="1" max="5" step="1"></div> <hr><div style="text-align:center; margin-top: 10px">Order Price</div> <div style="text-align:center; margin-top: 10px; font-weight: bold">{{orderData.quantity * product.price | currency: "€"}}</div>',
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

.controller('OrdersCtrl', function($scope, Restangular, $ionicLoading) {

    //$scope.orders = Orders.all();
    $ionicLoading.show({
        noBackdrop: false,
        template: 'Loading'
    });

    //get active cart (could be stored in a variable instead of asking the server every time)
    //get orders from that cart (hardcoded cartid=6)
    Restangular.one('actualorders').getList(1).then(function(data){
        $scope.orders = data;
        $ionicLoading.hide();
    });
})

.controller('OrderCtrl', function($scope, $stateParams, Restangular, $ionicLoading, AuthService) {

    //$scope.orders = Orders.all();
    $ionicLoading.show({
        noBackdrop: false,
        template: 'Loading'
    });

    //console.log($stateParams.orderId);
    Restangular.all('order').customGET($stateParams.orderId, {}, {'x-access-token': AuthService.token()}).then(function(data){
        $scope.order = data;
        $ionicLoading.hide();
    });
})

.controller('PlacesCtrl', function($scope, $stateParams, PlacesService, Restangular, AuthService) {
    $scope.loggedUser = AuthService.loggedUser();
    
    $scope.places = PlacesService.all();
    $scope.place = PlacesService.get($stateParams.placeId);
	
	$scope.generateqrcode = function(customerid) {
        
        Restangular.all('requestentry').customGET("", {}, {'x-access-token': AuthService.token()}).then(function(data){
				console.log("ok");
            
                new QRCode(document.getElementById("qrcode"), data.token);
				
			}, function(resp) {
				console.log("error");

			});
    };
})

.controller('InitialCtrl', function($scope, $stateParams, AuthService, $state, Restangular, AlertPopupService, FooterService, SocketService) {

    FooterService.changeFooter(false);

    setTimeout(function(){

        //verificar se o user ja esta logado e se token é valido
        if ($stateParams.username) {
            $scope.user = {username: ''};
            $scope.user.username = $stateParams.username;
        }

        var loggedUser = AuthService.loggedUser();
        console.log(loggedUser);
        console.log(AuthService.token());

        if (loggedUser) {

            Restangular.all('checklogin').customGET( "", {}, {'x-access-token': AuthService.token()}).then(function(data){

                console.log(data);

                if(data.result != "success") {
                    AlertPopupService.createPopup("Error", "Your login has expired. Please login again.");
                    $state.go('login');
                }else{
                    AuthService.login(loggedUser, AuthService.token());
                    //no mobile não faz o disconnect, não é preciso voltar a fazer o connect.
                    //SocketService.connectSocket(loggedUser.username);
                    $state.go('menu');
                }
            }, function(data){
                AlertPopupService.createPopup("Error", "Couldn't connect to server. Please verify your connection.");
                $state.go('login');
            });
        }
        else{
            $state.go('login');
        }

        FooterService.changeFooter(true);

    }, 1500);


})