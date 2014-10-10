var app = angular.module('services', [])




/**
 * A simple example service that returns some data.
 */
app.factory('Orders', function() {
    // Might use a resource here that returns a JSON array

    // Some fake testing data
    var orders = [
        { id: 0, code: 'ABCD0123', date: '10:20:35', products: [ {product: 'Rum', quantity: 2}, {product:'Coca Cola', quantity: 3}], price: '5.00', credit: '6.00', after: '+1.00', ready: true },
        { id: 1, code: 'ABCD0124', date: '10:25:35', products: [ {product: 'Vodka', quantity: 1}], price: '4.00', credit: '6.00', after: '+2.00', ready: false }
    ];

    return {
        all: function() {
            return orders;
        },
        get: function(orderId) {
            // Simple index lookup
            return orders[orderId];
        }
    }
})


app.factory('Places', function(){

    //fake places
    var places = [
        { id: 0, name: 'Discoteca X'},
        { id: 1, name: 'Y Club'},
        { id: 2, name: 'Bar Z'}
    ];

    return {
        all: function() {
            return places;
        },
        get: function(placeId) {
            // Simple index lookup
            return places[placeId];
        }
    }
})