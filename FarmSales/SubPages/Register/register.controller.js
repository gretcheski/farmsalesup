(function () {
    'use strict';

    angular
        .module('izerspa')
        .controller('RegisterController', RegisterController);

    RegisterController.$inject = ['UserService', '$location', '$rootScope', 'FlashService', '$scope'];
    function RegisterController(UserService, $location, $rootScope, FlashService, $scope) {
        var vm = this;
        console.log("Register Controller reporting for duty.");
        vm.register = register;

        function register() {
            vm.dataLoading = true;
            UserService.Create(vm.user, function (response) {
                if (response.success) {
                    FlashService.Success('Registro bem sucedido!', true);
                    alert("Registro OK!");
                    $location.path('/login');
                    $scope.$apply();
                } else {
                    FlashService.Error(response.message);
                    vm.dataLoading = false;
                }
            });
        }
    }

})();