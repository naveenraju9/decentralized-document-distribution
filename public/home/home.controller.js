﻿(function () {
    'use strict';

    angular
        .module('app')
        .controller('HomeController', HomeController)
        .directive('fileModel', ['$parse', function ($parse) {
            return {
               restrict: 'A',
               link: function(scope, element, attrs) {
                  var model = $parse(attrs.fileModel);
                  var modelSetter = model.assign;
    
                  element.bind('change', function(){
                     scope.$apply(function(){
                        modelSetter(scope, element[0].files[0]);
                     });
                  });
               }
            };
         }])
         .service('fileUploadService', ['$http', function ($http) {
            this.uploadFileToUrl = function(file, uploadUrl, address, docType){

               var fd = new FormData();
               fd.append('file', file);
               fd.append('address', address);
               fd.append('documentType', docType);
               console.log("docType>>>", docType);

    
               return $http.post(uploadUrl, fd, {
                  transformRequest: angular.identity,
                  headers: {'Content-Type': undefined}
               }).then(function(response){
                    return response.data;
               },function(err){
                    return err;
               })
            }
         }]);

    HomeController.$inject = ['UserService', '$rootScope', '$scope', 'fileUploadService', '$location'];
    function HomeController(UserService, $rootScope, $scope, fileUploadService, $location) {

        var vm = this;

        vm.user = null;

        initController();

        $scope.documents = [
            {
                "name" : "Aadhar Card",
                "code" : "aadhar"
            },
            {
                "name" : "Pan Card",
                "code" : "pan"
            },
            {
                "name" : "Voter ID",
                "code" : "VID"
            },
            {
                "name" : "Driving Licence",
                "code" : "DL"
            }
        ];

        function initController() {
            $scope.userDetails = $location.search().data;
            //loadCurrentUser();
        }

        function loadCurrentUser() {
            UserService.GetByUsername($rootScope.globals.currentUser.username)
                .then(function (user) {
                    vm.user = user;
                });
        }

        $scope.uploadFile = function(){
            console.log("inside uploadfile")
            var file = $scope.myFile;
            console.log("file>>>", file)
            var uploadUrl = "http://localhost:3000/savedata";
            var docType = $scope.document;
            fileUploadService.uploadFileToUrl(file, uploadUrl, $scope.userDetails.address, docType).then(function(res){
                $scope.myFile = "";
                if (res.status) {
                    $scope.myFile = "";
                }
            });
         };
    }
})();