var app = angular.module('controllers', []);

app.controller('IncomingOrdersCtrl', function($scope, $state, Restangular){

    $scope.notify = true;
    $scope.deliver = true;
    $scope.orders = null;
    $scope.all_orders = null;

    Restangular.one('incomingorders').getList(1).then(function(data){
        $scope.orders = data;
        $scope.all_orders = angular.copy($scope.orders);
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


    }

    //JUST AN EXAMPLE
    $scope.changeNotify = function(){
        console.log("Notify changed");

        //se novo valor = true -> adicionar as que estão orderstate = 'ordered'
        //se novo valor = false -> remover as que estão orderstate = 'ordered'
        if($scope.notify == false) {

            var delete_indexes = [];

            for (var i = 0; i < $scope.orders.length; i++) {
                if ($scope.orders[i].orderstate == 'ordered') {
                    delete_indexes.push(i);
                }
            }

            console.log(delete_indexes);

            for (var j = delete_indexes.length - 1; j >= 0; j--)
                $scope.orders.splice(delete_indexes[j], 1);

            console.log($scope.orders);
        }
        else if($scope.notify == true){
            console.log($scope.all_orders);
            var add_orders = [];

            for (var i = 0; i < $scope.all_orders.length; i++) {
                if ($scope.all_orders[i].orderstate == 'ordered') {
                    add_orders.push($scope.all_orders[i]);
                }
            }

            console.log(add_orders);
            for (var j = 0; j < add_orders.length; j++) {
                $scope.orders.push(add_orders[j]);
            }
            //reordenar o array por data

            $scope.orders.sort(function(a,b){
                return a.orderstime > b.orderstime;
            })
        }
    }


    $scope.changeDeliver = function() {
        console.log("Deliver changed");
        console.log($scope.all_orders);
        //se novo valor = true -> adicionar as que estão orderstate = 'notified'
        //se novo valor = false -> remover as que estão orderstate = 'notified'
        if($scope.deliver == false) {

            var delete_indexes = [];

            for (var i = 0; i < $scope.orders.length; i++) {
                if ($scope.orders[i].orderstate == 'notified') {
                    delete_indexes.push(i);
                }
            }

            console.log(delete_indexes);

            for (var j = delete_indexes.length - 1; j >= 0; j--)
                $scope.orders.splice(delete_indexes[j], 1);

            console.log($scope.orders);
        }
        else if($scope.deliver == true){
            console.log($scope.all_orders);
            var add_orders = [];

            for (var i = 0; i < $scope.all_orders.length; i++) {
                if ($scope.all_orders[i].orderstate == 'notified') {
                    add_orders.push($scope.all_orders[i]);
                }
            }

            console.log(add_orders);
            for (var j = 0; j < add_orders.length; j++) {
                $scope.orders.push(add_orders[j]);
            }
            //reordenar o array por data

            $scope.orders.sort(function(a,b){
                return a.orderstime > b.orderstime;
            })
        }
    }


})




