(function () {
    'use strict';

    angular
        .module('app')
        .controller('LoginController', LoginController);

    LoginController.$inject = ['$location', 'FlashService', 'UserService'];
    function LoginController($location, FlashService, UserService) {
        var vm = this;

        vm.login = login;
        function login() {
            vm.dataLoading = true;
            UserService.login(vm.username, vm.password).then(function(response){
                console.log("response>>", response)
                if (response.success) {
                    $location.path('/').search({data: response.message});
                    // if(parseInt(response.message.role) === 1) {
                    //     console.log("inside if")
                    //     $location.path('/recomenderHome').search({data: response.message});
                    // } else {
                    //     console.log("inside else")
                    //     $location.path('/').search({data: response.message});
                    // }
                    } else {
                    FlashService.Error(response.message);
                    m.dataLoading = false;
                }
            })

        };


    }

})();
