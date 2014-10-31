var app = angular.module('controllers', []);

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

app.controller('NavCtrl', function($scope, $state, $ionicPopup, $cordovaBarcodeScanner) {

    $scope.scan = function(){
        $state.go('scan');
    }
    
    
    $scope.scanBarcode = function()
	{
        $cordovaBarcodeScanner.scan().then(function(imageData) {
		
			if(imageData.text.indexOf("establishmentid") >= 0 && imageData.text.indexOf("customerid") >= 0)
			{
				var imageDataWithoutBrackets = imageData.text.split("{");
				imageDataWithoutBrackets = imageDataWithoutBrackets[1].split("}");

				var tokens = imageDataWithoutBrackets[0].split(",");

				var establishmentid = tokens[0].split(":")[1];
				var customerid = tokens[1].split(":")[1];
				
				alert("Welome to establishmentid " + establishmentid + ", customerid " + customerid + "!");
			}
			else
			{
				alert("Wrong QR code!");
			}
        }, function(error) {
            
        });
    };

})
