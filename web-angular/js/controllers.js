var app = angular.module('controllers', []);

app.controller('SidebarCtrl', function($scope, $state){

    $scope.toggleSidebar = false;

    $scope.toggle =  function(e){
        //e.preventDefault();
        //document.getElementById('wrapper').toggleClass("toggled");
        $scope.toggleSidebar = !$scope.toggleSidebar;
        
        
    };

});


app.controller('IncomingOrdersCtrl', function($scope, $state, Restangular){

    $scope.ordered = 'ordered';
    $scope.notified = 'notified';
    $scope.orders = null;

    $scope.showOrder = function(order){
        return order.orderstate === $scope.ordered || order.orderstate === $scope.notified;
    };
	
    Restangular.one('incomingorders').getList(1).then(function(data){
        $scope.orders = data;
    }), function(data){
        console.log("Error");
    };

    $scope.removeOrder = function(orderid){
        console.log("Remove Order Function");
        var index = -1;

        for( var i = 0; i < $scope.orders.length; i++ ) {
            if( $scope.orders[i].ordersid === orderid ) {
                index = i;
                break;
            }
        }

        if(index == -1)
            console.log("Error. Order not found.");
        else
            $scope.orders.splice(index, 1);
    }


    $scope.notifyOrder = function(orderid){
        console.log("Notify Order Function");

        var notify_order = {"orderid": orderid};
        console.log(notify_order);
        Restangular.all('notify').post(notify_order).then(function(resp){
            for( var i = 0; i < $scope.orders.length; i++ ) {
                if( $scope.orders[i].ordersid === orderid ) {
                    $scope.orders[i].orderstate = 'notified';
                    break;
                }
            }
            console.log("User notifed");
        }, function(resp){
            console.log("Error notifying user");
        });


    };
});

app.controller('ProductsCtrl', function($scope, $stateParams, Restangular) {


    //hardcoded establishment id=4
    var products = Restangular.one('products').getList(1).then(function(data){
        $scope.products = data;
    })
	
	$scope.addProduct=function()
	  {
	   $state.go("product-add");
	  }
	
});

app.controller('ProductAdd', function($state, $scope, $stateParams,Restangular) {

	  $scope.addProduct=function()
	  {
	   console.log($scope);
	   
	   var body= {"establishmentid": 1,"categoryid":$scope.product.categoryid,
	   "name":$scope.product.name,"price":$scope.product.price,"description":$scope.product.description};
	   
	    var teste =Restangular.all('add-product').post(body).then(function (resp){
            console.log("ok");
            console.log(resp);
			//$state.go("products");
	  });
	   
	  }
	
});

app.controller('ProductCtrl', function($state, $scope, $stateParams,Restangular) {


    var product = Restangular.one('product', $stateParams.productId).get().then(function(data){
        $scope.product = data[0];
		console.log($scope.product);
      })
	  
	  $scope.deleteProduct=function()
	  {
	   console.log($scope.product.productid);
	   var productid = {"productid": $scope.product.productid};
	   
	    var teste =Restangular.all('delete-product').post(productid).then(function (resp){
            console.log("ok");
            console.log(resp);
	  });
	  }
	  
	  $scope.editProduct=function()
	  {
	   console.log($scope.product);
	    console.log($scope.product.name);
		 console.log($scope.product.description);
		  console.log($scope.product.price);
	   var body= {"productid": $scope.product.productid,"categoryid":$scope.product.categoryid,
	   "name":$scope.product.name,"price":$scope.product.price,"description":$scope.product.description};
	   
	    var teste =Restangular.all('edit-product').post(body).then(function (resp){
            console.log("ok");
            console.log(resp);
			$state.go("products");
	  });
	   
	  }
});

app.controller('CustomersCtrl', function($state, $scope, $stateParams, Restangular) {

	var customer = Restangular.one('customer').getList(2).then(function(data){
		$scope.customers=data;
	})

});


