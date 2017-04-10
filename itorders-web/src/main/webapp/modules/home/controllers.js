'use strict';

angular.module('Home')

.controller('HomeController',
    ['$scope', '$rootScope', '$location','sharedStateService',
    function ($scope, $rootScope, $location, sharedStateService) {
        $scope.user = $rootScope.globals.currentUser.username;
        $scope.userrole = $rootScope.globals.currentUser.role;
        $scope.serverInfo = $rootScope.kieServer;
        $scope.date = new Date();
        $scope.selectedType = "";

        $scope.go = function ( path ) {
            $location.path( path );
          };


          $scope.selectType = function(type) {
            $scope.selectedType = type;
            sharedStateService.setSelectedType(type);
          };
    }])

.controller('HeaderController',
        ['$scope', '$location',
            function ($scope, $location)  {
            $scope.isActive = function (viewLocation) {
            return viewLocation === $location.path();
        }
    }]);
