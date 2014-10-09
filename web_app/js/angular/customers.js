(function() {
  var app = angular.module('customerApp', []);

  app.controller('CustomerController', function(){
   this.customers = customers; 
  });

  var customers = [
    { name: 'José Faria', email:'josefaria@email.com',balance: 2.95 },
	{ name: 'João Nadais', email:'joaonadais@email.com',balance: 7 },
	{ name: 'João Sá', email:'joaosa@email.com',balance: 20 },
	{ name: 'Gil Rocha', email:'gilrocha@email.com',balance: 2.5 },
	{ name: 'Hugo Sousa', email:'hugosousa@email.com',balance: 5.7 },
	{ name: 'Francisco Maciel', email:'franciscomaciel@email.com',balance: 0 },
  ];
})();
