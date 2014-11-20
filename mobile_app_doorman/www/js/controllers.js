var app = angular.module('controllers', []);

app.controller('FooterCtrl', function ($scope, $state, $ionicPopup) {
    $scope.showFooter = true;

    window.addEventListener('native.keyboardshow', function () {
        $scope.showFooter = false;
        $scope.$apply();
        /*
        $ionicPopup.alert({
            title: 'Keyboard Show',
            template: 'Keyboard Show'
        });
        */
    });

    window.addEventListener('native.keyboardhide', function () {
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


app.controller('LoginCtrl', function ($scope, $state, $stateParams, Restangular, AuthService, $ionicLoading, $ionicPopup) {
    //console.log(AuthService.loggedUser());
    if ($stateParams.username) {
        $scope.user = {
            username: ''
        };
        $scope.user.username = $stateParams.username;
    }


    var loggedUser = AuthService.loggedUser();

    if (loggedUser) $state.go('scan');

    $scope.loginSubmit = function () {
        console.log("Login");
        var bitArray = sjcl.hash.sha256.hash($scope.user.password);
        var digest_sha256 = sjcl.codec.hex.fromBits(bitArray);


        console.log($scope.user);
        $ionicLoading.show({
            template: 'Logging in...'
        });
        //TODO: encrypt password
        Restangular.all('login').post({
            username: $scope.user.username,
            password: digest_sha256
        }).then(function (resp) {
            console.log("ok");
            console.log(resp);

            AuthService.login(resp.user, resp.access_token);

            $ionicLoading.hide();

            if (resp.user.permission == 'doorman') {
                $state.go('scan');
            } else {
                // An alert dialog
                var alertPopup = $ionicPopup.alert({
                    title: 'card@night',
                    template: 'Specified user is not a doorman!'
                });
            }
        }, function (resp) {

            var error = "";
            if (resp.status == 0)
                error = "Please check your Internet connection.";
            else if (resp.status == 401)
                error = resp.data.error;
            else
                error = "Something went wrong.";

            $ionicPopup.alert({
                title: 'Error',
                template: '<p style="text-align: center">' + error + '</p>'
            });

            console.log(resp);

            $ionicLoading.hide();
        });
    };

})

app.controller('NavCtrl', function ($scope, $state, $stateParams, $ionicPopup, $cordovaBarcodeScanner, Restangular, AuthService) {
    $scope.scan = function () {
        $state.go('scan');
    }


    $scope.login = function () {
        $state.go('login');
    }


    $scope.scanBarcode = function () {
        $cordovaBarcodeScanner.scan().then(function (imageData) {

            Restangular.all('gate').one(imageData.text).customPOST("", "", {}, {
                'x-access-token': AuthService.token()
            }).then(function (data) {

                if (imageData.text.length > 0) {
                    console.log("ok");

                    document.getElementById("checkImage").src = "ok.png"
                }

            }, function (resp) {
                if (resp.data.indexOf("Not enough or too many segments") > -1) {
                    alert("Error reading QR Code! Please try again");
                } else {
                    if (imageData.text.length > 0) {
                        console.log("error");

                        document.getElementById("checkImage").src = "error.png";
                    }
                }
            });
        });

    }

})

.controller('AccountCtrl', function ($scope, $state, $stateParams, $ionicPopup, Restangular, AuthService) {

    var loggedUser = AuthService.loggedUser();
    $scope.loggedUser = AuthService.loggedUser().username;

    $scope.logout = function () {
        AuthService.logout();
        $state.go('login');
    }
})