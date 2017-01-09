'use strict';

angular.module('Authentication')

.controller('LoginController',
    ['$scope', '$rootScope', '$location', 'AuthenticationService', 'CasesService', 'appConfig',
    function ($scope, $rootScope, $location, AuthenticationService, CasesService, appConfig) {
        // reset login status
    	document.getElementById("app-body").setAttribute('style', 'background-color:#1D2226;');
        AuthenticationService.ClearCredentials();

        $scope.login = function () {
            $scope.dataLoading = true;
            AuthenticationService.Login($scope.username, $scope.password, appConfig.get('kieserver_url'), function (response) {
                if (response.success) {
                    AuthenticationService.SetCredentials($scope.username, $scope.password);
                    $rootScope.kieServer = response.data;
                    CasesService.GetDefinitions(function (response2) {

                        if (response2.success) {
                        	document.getElementById("app-body").removeAttribute('style');
                            $rootScope.cases = response2.data;
                            $location.path('/');
                        } else {
                            $scope.error = response2.message;
                            $scope.dataLoading = false;
                        }
                    });


                } else {
                    $scope.error = response.message;
                    $scope.dataLoading = false;
                }
            });
        };
    }]);
