(function() {
  var app = angular.module('barApp', []);

  app.controller('CustomerController', function(){
   this.customers = customers; 
  });
  app.controller('ProductsController', function(){
   this.products = products; 
  });

  var customers = [
    { name: 'José Faria', email:'josefaria@email.com',balance: 2.95 },
	{ name: 'João Nadais', email:'joaonadais@email.com',balance: 7 },
	{ name: 'João Sá', email:'joaosa@email.com',balance: 20 },
	{ name: 'Gil Rocha', email:'gilrocha@email.com',balance: 2.5 },
	{ name: 'Hugo Sousa', email:'hugosousa@email.com',balance: 5.7 },
	{ name: 'Francisco Maciel', email:'franciscomaciel@email.com',balance: 0 },
  ];
  var products = [
    { description: 'Dry Gin', image:'image',price: 3, name:'Gin' },
	{ description: 'Russian Vodka', image:'image',price: 5, name:'Vodka' },
	{ description: 'Rough Absinthe', image:'image',price: 2.95, name:'Absinthe' },
	{ description: 'Bad beer', image:'image',price: 0.3, name:'Beer' },
	{ description: 'Good beer', image:'image',price: 1, name:'Portuguese beer' },
	{ description: 'Very good beer', image:'image',price: 1.5, name:'Belgian beer' },
	{ description: 'Typical Porto wine', image:'image',price: 2.5, name:'Porto wine' },
  ];
});
