var app = angular.module('controllers', ['highcharts-ng', 'vr.directives.slider']);

app.controller('CustomerDeleteConsumptionCtrl', function ($scope, $state, $modalInstance, Restangular, alertService) {


    $scope.ok = function () {
        alertService.clear();
        Restangular.all('delete-customer-consumption').post({
            "cartId": $scope.cartId
        }).then(function (resp) {

            alertService.add('success', 'Cart deleted successfully');
            $state.go("customers");

        }, function (resp) {
            console.log("Error notifying user");
        });
        $modalInstance.close();
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

});

app.controller('CustomerMarkPaidCtrl', function ($scope, $modalInstance, Restangular, alertService) {


    $scope.ok = function (parameter) {
        Restangular.all('mark-cart-paid').post({
            "cartId": $scope.customer.cartid
        }).then(function (resp) {

            $scope.customer.paid = true;
            $scope.customer.shown = ($scope.showAll == 'showAll');
            alertService.add('success', 'Customer cart paid successfully');
        }, function (resp) {
            alert("Error notifying user");
        });
        $modalInstance.close();
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

});



//used to control alerts
function RootCtrl($rootScope, $location, alertService) {
    $rootScope.changeView = function (view) {
        $location.path(view);
    }
    // root binding for alertService
    $rootScope.closeAlert = alertService.closeAlert;
}
RootCtrl.$inject = ['$scope', '$location', 'alertService'];



app.controller('SidebarCtrl', function ($scope, $state) {

    $scope.toggleSidebar = false;

    $scope.toggle = function (e) {
        //e.preventDefault();
        //document.getElementById('wrapper').toggleClass("toggled");
        $scope.toggleSidebar = !$scope.toggleSidebar;


    };

});



app.controller('IncomingOrdersCtrl', function($scope, $state, Restangular, alertService, AuthService, SocketService){

	if(! SocketService.getSocket())
		SocketService.connectSocket(AuthService.loggedUser().establishmentid);

	$scope.ordered = 'ordered';
    $scope.notified = 'notified';
    $scope.orders = null;
    alertService.clear();

	SocketService.getSocket().on('new_order', function(data) {
		//console.log("NEW ORDER");
		//console.log(data);
		var parsed_data = JSON.parse(data);
		$scope.orders.push({orderstime: parsed_data.date, code: parsed_data.code, name: parsed_data.product, quantity: parsed_data.quantity, orderstate: "ordered"});
		$scope.$apply();
	});


    $scope.showOrder = function(order){
        return order.orderstate === $scope.ordered || order.orderstate === $scope.notified;
    };

    Restangular.one('incomingorders').getList(AuthService.loggedUser().establishmentid).then(function (data) {
        $scope.orders = data;
    }),
    function (data) {
        console.log("Error");
    };

    $scope.removeOrder = function (orderid) {
        console.log("Remove Order Function");
        var index = -1;

        for (var i = 0; i < $scope.orders.length; i++) {
            if ($scope.orders[i].ordersid === orderid) {
                index = i;
                break;
            }
        }

        if (index == -1)
            console.log("Error. Order not found.");
        else {

            var deliver_order = {
                "orderid": orderid
            };

            Restangular.all('deliver').post(deliver_order).then(function (resp) {
                $scope.orders.splice(index, 1);
            }, function (resp) {
                console.log("Error on delivery.");
            });


            //$scope.orders.splice(index, 1);
        }
    }


    $scope.notifyOrder = function (orderid) {
        console.log("Notify Order Function");

        var notify_order = {
            "orderid": orderid
        };
        console.log(notify_order);
        Restangular.all('notify').post(notify_order).then(function (resp) {
            for (var i = 0; i < $scope.orders.length; i++) {
                if ($scope.orders[i].ordersid === orderid) {
                    $scope.orders[i].orderstate = 'notified';
                    break;
                }
            }
            console.log("User notifed");
        }, function (resp) {
            console.log("Error notifying user");
        });


    };
});

app.controller('ProductsCtrl', function ($scope, $stateParams, Restangular, alertService, AuthService) {
    $scope.permission = AuthService.loggedUser().permission;

    //hardcoded establishment id=1
    var products = Restangular.one('products').getList(AuthService.loggedUser().establishmentid).then(function (data) {
        $scope.products = data;
    })

    $scope.addProduct = function () {
        $state.go("product-add");
        alertService.clear();
    }
});

app.controller('ProductAdd', function ($state, $scope, $stateParams, Restangular, $scope, $modal) {

    $scope.open = function (size) {
        $scope.modalInstance = $modal.open({
            templateUrl: 'confirmAdd.html',
            controller: 'ProductAddConfirm',
            size: size,
            scope: $scope
        });
    };
});


app.controller('ProductAddConfirm', function ($state, $scope, $stateParams, Restangular, $modalInstance, alertService) {

    alertService.clear();
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.addProduct = function () {
        console.log($scope.product);

        var body = {
            "establishmentid": 1,
            "categoryid": $scope.product.categoryid,
            "name": $scope.product.name,
            "price": $scope.product.price,
            "description": $scope.product.description
        };

        console.log('teste');

        var teste = Restangular.all('add-product').post(body).then(function (resp) {
            $modalInstance.dismiss('cancel');
            alertService.add('success', 'Product added successfully');
            $state.go("products");
        },function() {
			$modalInstance.dismiss('cancel');
            alertService.add('danger', 'Product already exists');
            $state.go("products");
		});
    }
})

app.controller('ProductCtrl', function ($state, $scope, $stateParams, Restangular, $modal, alertService, AuthService) {

    $scope.days = 90;

    alertService.clear();
    $scope.permission = AuthService.loggedUser().permission;
    var product = Restangular.one('product', $stateParams.productId).get().then(function (data) {
        $scope.product = data[0];
        console.log($scope.product);
        $scope.updateChart();
    })

    $scope.openEdit = function (size) {
        console.log("edit");
        $scope.modalInstance = $modal.open({
            templateUrl: 'confirmEdit.html',
            controller: 'ProductEditConfirm',
            size: size,
            scope: $scope
        });
    };

    $scope.openDelete = function (size) {
        $scope.modalInstance = $modal.open({
            templateUrl: 'confirmDelete.html',
            controller: 'ProductDeleteConfirm',
            size: size,
            scope: $scope
        });
    };


    $scope.updateChart = function() {
        var xdata = [];
        var ydata = [];

        Restangular.all('producthistory').customGET($stateParams.productId + "/" + $scope.days, {}, {
            'x-access-token': AuthService.token()
        }).then(function (data) {

            for (var i = 0; i < data.length; i++) {

                var obj = data[i];

                for (var key in obj) {
                    if (key == "salesdate") {
                        xdata.push(obj[key]);
                    } else {
                        if (key == "sales") {
                            ydata.push(parseInt(obj[key]));
                        }
                    }
                }
            }

            //ydata.push(1);

            console.log(JSON.stringify(ydata));

            $scope.chartConfig = {
                options: {
                    chart: {
                        type: 'line',
                        zoomType: 'x'
                    },
                    colors: ['#0080ff'],
                    plotOptions: {
                        series: {
                            cursor: 'pointer',
                            point: {
                                events: {
                                    click: function (e) {
                                        // console.log("Click");
                                    }
                                }
                            },
                            marker: {
                                lineWidth: 1,
                                symbol: 'circle'
                            }
                        }
                    }

                },
                series: [{
                    data: ydata
                }],
                title: {
                    text: 'Sales of last ' + $scope.days + ' days'
                },
                xAxis: {
                    type: "category",
                    labels: {
                        enabled: false
                    }
                },
                yAxis: {
                    min: 0
                },
                loading: false
            }
        });
    }
});

app.controller('ProductDeleteConfirm', function ($state, $scope, $stateParams, Restangular, $modalInstance, alertService) {
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
    $scope.deleteProduct = function () {
        console.log($scope.product.productid);
        var productid = {
            "productid": $scope.product.productid
        };

        var teste = Restangular.all('delete-product').post(productid).then(function (resp) {
            console.log("ok");
            console.log(resp);
            $modalInstance.dismiss('cancel');
            alertService.add('success', 'Product deleted successfully');
            $state.go("products");
        });
    }

})

app.controller('ProductEditConfirm', function ($state, $scope, $stateParams, Restangular, $modalInstance, alertService) {
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.editProduct = function () {
        console.log($scope.product);

        var body = {
            "productid": $scope.product.productid,
            "categoryid": $scope.product.categoryid,
            "name": $scope.product.name,
            "price": $scope.product.price,
            "description": $scope.product.description
        };

        var test = Restangular.all('edit-product').post(body).then(function (resp) {
            console.log("ok");
            console.log(resp);
            $modalInstance.dismiss('cancel');
            alertService.add('success', 'Product edited successfully');
            $state.go("products");
        });
    }
});
app.controller('CustomerCtrl',function($state,$scope,$stateParams,Restangular,$modal,$log,AuthService)
               {
    var customer = Restangular.one('customer').getList($stateParams.customerid).then(function (data) {
		$scope.customer = data[0];
        $scope.updateChart();
	});
    $scope.updateChart = function() {
        var xdata = [];
        var ydata = [];
        Restangular.all('customer_managerHistory').customGET($scope.customer.customerid + "/" + AuthService.loggedUser().establishmentid, {}, {
            'x-access-token': AuthService.token()
        }).then(function (data) {

            for (var i = 0; i < data.length; i++) {
                        xdata.push(data[i].entrancetime);
                        ydata.push(parseFloat(data[i].balance));
                        }
                    });
        
            $scope.chartConfig = {
                options: {
                    chart: {
                        type: 'line',
                        zoomType: 'x'
                    },
                    colors: ['#0080ff'],
                    plotOptions: {
                        series: {
                            cursor: 'pointer',
                            point: {
                                events: {
                                    click: function (e) {
                                        // console.log("Click");
                                    }
                                }
                            },
                            marker: {
                                lineWidth: 1,
                                symbol: 'circle'
                            }
                        }
                    }

                },
                series: [{
                    data: ydata
                }],
                title: {
                    text: 'Customer history'
                },
                xAxis: {
                    labels: {
                        enabled: false
                    }
                },
                yAxis: {
                    min: 0
                },
                loading: false
            }
        };
});
app.controller('CustomersCtrl', function($state, $scope, $stateParams,Restangular,$modal,$log, AuthService) {

	//console.log(AuthService.loggedUser().establishmentid);
	var customer = Restangular.one('customers').getList(AuthService.loggedUser().establishmentid).then(function (data) {
		//console.log(JSON.stringify(data));
		$scope.customers = data;
        $scope.checkCartsSameName();
		$scope.showAllCustomers();
	});
    $scope.checkCartsSameName=function()
    {
        var customers={};
        for(var i = 0;i<$scope.customers.length;i++)
        {
            if(customers[$scope.customers[i].name]==undefined)
            {
                customers[$scope.customers[i].name]=$scope.customers[i];
                customers[$scope.customers[i].name].cart=new Array();
                var cart={};
                cart.exittime=$scope.customers[i].exittime;
                if(cart.exittime==null)
                {
                    customers[$scope.customers[i].name].paid=false;
                }
                cart.entrancetime=$scope.customers[i].entrancetime;
                cart.balance=$scope.customers[i].balance;
                cart.cartid=$scope.customers[i].cartid;
                customers[$scope.customers[i].name].cart.push(cart);
            }
            else
            {
                 var cart={};
                cart.exittime=$scope.customers[i].exittime;
                if(cart.exittime==null)
                {
                    customers[$scope.customers[i].name].paid=false;
                }
                cart.entrancetime=$scope.customers[i].entrancetime;
                cart.balance=$scope.customers[i].balance;
                cart.cartid=$scope.customers[i].cartid;
                customers[$scope.customers[i].name].cart.push(cart);
            }
            
            
        }
        $scope.customers=customers;
        
    }
	$scope.showAll = 'no';
	$scope.showAllCustomers = function () {
		for (var customer in $scope.customers)
        {
            if($scope.customers.hasOwnProperty(customer))
               {
               if ($scope.customers[customer].paid) {
				if ($scope.customers[customer].shown == null)
					$scope.customers[customer].shown = false;
				else $scope.customers[customer].shown = !$scope.customers[customer].shown;
			}
			else
				$scope.customers[customer].shown = true;
               }
            console.log($scope.customers[customer]);
        }
	}
	$scope.getTotal = function (customerId) {
		var total = 0;

		for (var i = 0; i < $scope.customers.length; i++) {
			console.log($scope.customers[i]);
			if ($scope.customers[i].customerid == customerId) {
				console.log('teste');
				total += ($scope.customers[i].balance);
			}
		}
		return total;
	}

	$scope.openCartPaid = function (size, customer) {
		$scope.customer = customer;
        $scope.title="Confirm payment";
        $scope.body="Confirm payment of "+customer.name+"?";
        $scope.isPayCart=true;
		var modalInstance = $modal.open({
			templateUrl: 'myModalContent.html',
			controller: 'CustomerMarkPaidCtrl',
			size: size,
			scope: $scope
		});
	};
    $scope.openCartsAvailable = function (size, customer) {
		$scope.customer = customer;
        $scope.title="Check carts";
        $scope.isPayCart=false;
		console.log('Teste antes de open ' + $modal);
		var modalInstance = $modal.open({
			templateUrl: 'myModalContent.html',
			controller: 'CustomerMarkPaidCtrl',
			size: size,
			scope: $scope
		});
	};
});

app.controller('CartCtrl',function($state, $scope, $stateParams, Restangular,AuthService,$modal,$modalStack,$log) {
    $modalStack.dismissAll();
    console.log($stateParams.cartid);
	var customer = Restangular.one('cart').getList($stateParams.cartid).then(function (data) {
		$scope.customer = {};
		$scope.customer.info = data[0];
		if (data[1] != 0) {
			$scope.customer.cart = [];
			for (var i = 0; i < data[1].length; i++)
				$scope.customer.cart.push(data[1][i]);
		}
		else
			$scope.customer.cart = [];
        $scope.updateChart();
	});

	$scope.open = function (size, customer) {

		console.log(customer);
		$scope.cartId = customer;
		var modalInstance = $modal.open({
			templateUrl: 'myModalContent.html',
			controller: 'CustomerDeleteConsumptionCtrl',
			size: size,
			scope: $scope
		});

		$scope.open = function (size, customer) {

			console.log(customer);
			$scope.cartId = customer;
			var modalInstance = $modalInstance.open({
				templateUrl: 'myModalContent.html',
				controller: 'CustomerDeleteConsumptionCtrl',
				size: size,
				scope: $scope
			});
		}
	}
    });




app.controller('LoginCtrl', function($scope, $state, Restangular, AuthService) {

	$scope.submitted= false;
	
	$scope.errorMessage= "";
	
	$scope.invalidInput= false;
	
	$scope.loginSubmit = function() {
 		
		var bitArray = sjcl.hash.sha256.hash($scope.user.password);
        var password = sjcl.codec.hex.fromBits(bitArray);
		
		var userStructure= {"username": $scope.user.username, "password": $scope.user.password};		
		
        Restangular.all('login').post(userStructure).then(function (resp){
						
			$scope.submitted= true;
			
						
			if(resp.user.permission == 'manager' || resp.user.permission == 'employee')
			{			
				$scope.invalidInput= false;
				
				AuthService.login(resp.user, resp.access_token);
            
				$state.go('incoming-orders');
			
			}
			else
			{
				
				$scope.invalidInput= true;
				
				$scope.errorMessage= "Access Denied. You don't have permission to access this site.";
		
			}			
			
        }, function(resp){
				
			$scope.submitted= true;
			
			$scope.invalidInput= true;
						
            if(resp.status == 0)
                $scope.errorMessage = "Please check your Internet connection.";
            else if(resp.status == 401)
                $scope.errorMessage = resp.data.error;
            else
                $scope.errorMessage = "Something went wrong.";
				
				
        });
		
	
	
	}
	
});