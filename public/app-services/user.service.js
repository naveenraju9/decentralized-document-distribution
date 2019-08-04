(function () {
    'use strict';

    angular
        .module('app')
        .factory('UserService', UserService);

    UserService.$inject = ['$http', '$q'];
    function UserService($http, $q) {
        var service = {};

        service.GetAll = GetAll;
        service.GetById = GetById;
        service.GetByUsername = GetByUsername;
        service.Create = Create;
        service.Update = Update;
        service.Delete = Delete;
        service.login = login;
        service.getdocumentListWithPurpose = getdocumentListWithPurpose;
        service.getUserDetails = getUserDetails;
        service.getDocumentDetailsByUserId = getDocumentDetailsByUserId;
        service.createPurpose = createPurpose;
        service.subscribe = subscribe;

        return service;

        function GetAll() {
            return $http.get('/api/users').then(handleSuccess, handleError('Error getting all users'));
        }

        function GetById(id) {
            return $http.get('/api/users/' + id).then(handleSuccess, handleError('Error getting user by id'));
        }

        function GetByUsername(username) {
            return $http.get('/api/users/' + username).then(handleSuccess, handleError('Error getting user by username'));
        }

        function Create(user) {
            return $http.post('http://localhost:3000/registerUser', user).then(handleSuccess, handleError('Error creating user'));
        }

        function Update(user) {
            return $http.put('/api/users/' + user.id, user).then(handleSuccess, handleError('Error updating user'));
        }

        function Delete(id) {
            return $http.delete('/api/users/' + id).then(handleSuccess, handleError('Error deleting user'));
        }

        function login(username, password) {
            console.log("username>>",username, password)
            return $http.get('http://localhost:3000/loginUser',{params: {username: username,password: password}, headers : {'Accept' : 'application/json'}}).then(handleSuccess, handleError('Enter valid passcode'));
        }

        function getdocumentListWithPurpose(purpose) {
            return $http.get('http://localhost:3000/getDocumentListByPurpose', {params: {purpose : purpose}, headers : {'Accept' : 'application/json'}}).then(handleSuccess, handleError('Given purpose is invalid'));
        }

        function getUserDetails(userId) {
            return $http.get('http://localhost:3000/getUserDetailsByUserId', {params: {userId : userId}, headers : {'Accept' : 'application/json'}}).then(handleSuccess, handleError('Invalid userId'));
        }

        function getDocumentDetailsByUserId(userId) {
            return $http.get('http://localhost:3000/getDocumentDetailsByUserId', {params: {userId : userId}, headers : {'Accept' : 'application/json'}}).then(handleSuccess, handleError('Invalid userId'));
        }

        function createPurpose(userId, purpose) {
            console.log("userId, purpose", userId, purpose)
            return $http.post('http://localhost:3000/createPurpose', {userId: userId, purpose: purpose}).then(handleSuccess, handleError('Error creating the purpose'));
        }

        function subscribe(passCode, purpose, email) {
            return $http.post('http://localhost:3000/subscribe', {passcode: passCode, purpose: purpose, email: email}).then(handleSuccess, handleError('Error while submitting'));
        }

        // private functions

        function handleSuccess(res) {
            console.log("res>>>>", res)
            var deferred = $q.defer();
            deferred.resolve({ success: true, message: res.data});
            return deferred.promise;
        }

        function handleError(error) {
            
            return function () {
                return { success: false, message: error };
            };
        }
    }

})();
