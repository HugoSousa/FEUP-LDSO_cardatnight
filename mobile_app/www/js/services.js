var app = angular.module('services', [])

app.factory('Products', function(){

    //fake products
    var products = [
        { id: 0, name: 'Cuba', description: 'coca cola + rum', image: "C:\\Users\\Hugo\\Downloads\\drink.png", price: '5.00'},
        { id: 1, name: 'Vodka Limão', description: 'vodka + limão', image: "C:\Users\Hugo\Downloads\drink.png", price: '4.00'},
        { id: 2, name: 'Vodka Laranja', description: 'vodka + laranja', image: "C:\Users\Hugo\Downloads\drink.png", price: '5.00'},
        { id: 3, name: 'Licor Beirão', description: 'o melhor licor de portugal', image: "C:\Users\Hugo\Downloads\drink.png", price: '3.50'}
    ];

    return {
        all: function() {
            return products;
        },
        get: function(productId) {
            // Simple index lookup
            return products[productId];
        }
    }
})


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