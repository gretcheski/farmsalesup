(function () {
    'use strict';

    angular
        .module('izerspa')
        .controller('LoginController', LoginController);

    LoginController.$inject = ['$location', 'AuthenticationService', 'FlashService', '$scope'];
    function LoginController($location, AuthenticationService, FlashService, $scope) {
        var vm = this;
        console.log("Login Controller reporting for duty.");
        vm.login = login;

        (function initController() {
            // reset login status
            AuthenticationService.ClearCredentials();
        })();

        function login() {
            vm.dataLoading = true;
            AuthenticationService.Login(vm.Email, vm.Password, function (response) {
                if (response.success) {
                    alert("Login bem sucedido!");
                    $location.path('/');
                    $scope.$apply();
                } else {
                    FlashService.Error(response.message);
                    alert("Falha no login!");
                    vm.dataLoading = false;
                }
            });
        };
    }

})();