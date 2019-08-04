(function () {
    'use strict';

    angular
        .module('app')
        .controller('UploadDocumentsController', UploadDocumentsController)
        .directive('fileModelData', ['$parse', function ($parse) {
            return {
               restrict: 'A',
               link: function(scope, element, attrs) {
                   
                  var model = $parse(attrs.fileModelData);

                  console.log("model>>>>>", model)
                  var modelSetter = model.assign;
                  console.log("modelSetter>>>", modelSetter, scope)
                  element.bind('change', function(){
                     scope.$apply(function(){
                        console.log("element>>>",element[0].files[0])
                        modelSetter(scope, element[0].files[0]);
                     });
                  });
               }
            };
         }])
         .service('fileUpload', ['$http', function ($http) {
            this.uploadFileToUrl = function(file, uploadUrl, passcode){

               var fd = new FormData();
               fd.append('file', file);
               fd.append('passcode', passcode);

    
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

    UploadDocumentsController.$inject = ['UserService', '$rootScope', '$scope', 'fileUpload', '$location', '$parse'];
    function UploadDocumentsController(UserService, $rootScope, $scope, fileUpload, $location, $parse) {


        var vm = this;

        vm.user = null;
        $scope.documents = [];
        $scope.userInfo = {};
        $scope.documentDetails = [];

        $scope.$watch('myFile1', function(newFile){
            console.log("newFile>>>>>", newFile);
        })

        initController();

        function initController() {
            $scope.userDetails = $location.search();
            var purposeCode = $scope.userDetails.purpose;
            UserService.getdocumentListWithPurpose(purposeCode).then((documents)=> {
                console.log("documents>>>", documents)
                $scope.documents = angular.isDefined(documents) ? $parse('message.documents')(documents) : [];

            });

            UserService.getUserDetails($scope.userDetails.passcode).then((userInfo)=> {
                $scope.userInfo = userInfo;
            });

            UserService.getDocumentDetailsByUserId($scope.userDetails.passcode).then((documentDetails)=> {
                console.log("documentDetails>>>>", documentDetails);
                $scope.documentDetails = documentDetails;
            });

        }

        $scope.uploadFile = function(documentCode){
            console.log("scope>>>", $scope)
            var file = $scope.myFile1;
            var uploadUrl = "http://localhost:3000/savedata";
            console.log("data>>>", file, uploadUrl, $scope.userDetails.passcode, documentCode);
            fileUpload.uploadFileToUrl(file, uploadUrl, $scope.userDetails.passcode, documentCode).then(function(res){
                if (res.status) {
                }
            });
         };

         $scope.isDocumentAvailable = function(docType){
             var documents = $parse('documentDetails.message')($scope);
             var status = false;

             angular.forEach(documents, function(document){
                 if(docType === document.idType){
                    status = true;
                 }
             });
             return status;
         }
    }
})();