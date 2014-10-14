var app = angular.module('controllers', []);

app.controller('IncomingOrdersCtrl', function($scope, $state, Restangular){

    $scope.notify = true;
    $scope.delivery = true;
    $scope.orders = null;

    var all_orders = null;

    Restangular.one('incomingorders').getList(1).then(function(data){
        $scope.orders = data;
        all_orders = data;
    }), function(data){
        console.log("Error");
    };

    //verificar primeiro se já está no estado notified, senão não fazer nada
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

    //JUST AN EXAMPLE
    $scope.changeNotify = function(){
        console.log("Notify changed");

        //remover do $scope.orders as que tem ready = true
        var delete_indexes = [];

        for( var i = 0; i < $scope.orders.length; i++ ) {
            if( $scope.orders[i].ready == false ) {
                delete_indexes.push(i);
            }
        }

        //console.log(delete_indexes);

        for (var j = delete_indexes.length-1; j >= 0; j--)
            $scope.orders.splice(delete_indexes[j],1);

        console.log($scope.orders);
    }




})




