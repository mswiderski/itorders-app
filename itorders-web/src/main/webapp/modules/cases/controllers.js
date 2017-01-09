'use strict';

angular.module('Cases')

.controller('CasesController',
    ['$scope', '$rootScope', '$location', 'CasesService',
    function ($scope, $rootScope, $location, CasesService) {
            $scope.dataLoading = true;

            CasesService.GetContainers(function (response) {

                if (response.success) {
                    $scope.containers = response.data;
                    $location.path('/cases');
                } else {
                    $scope.error = response.message;
                    $scope.dataLoading = false;
                }
            });
    }]);