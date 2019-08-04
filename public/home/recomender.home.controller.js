(function () {
    'use strict';

    angular
        .module('app')
        .controller('RecomenderHomeController', RecomenderHomeController)
        
         

    RecomenderHomeController.$inject = ['$rootScope', '$scope', '$location', 'UserService'];
    function RecomenderHomeController($rootScope, $scope, $location, UserService) {

        var vm = this;

        console.log("jhasvdjhsagvdh")

        vm.subscribe = subscribe;

        function subscribe() {
            var passCode = $scope.passcode;
            var purpose = $scope.purpose;
            var email = $scope.email;

            UserService.subscribe(passCode, purpose, email).then((res)=>{
                console.log("res>>>", res);
            });

        }
        $scope.purposeList = [
            {
                "name" : "Create new Bank account",
                "code" : "CA"
            },
            {
                "name" : "HDFC Click2 invesment",
                "code" : "HDFCC2"
            },
            {
                "name" : "MaxLife Term insurance",
                "code" : "MLTI"
            }
        ];

    }
})();