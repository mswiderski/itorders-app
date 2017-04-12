'use strict';

angular.module('Home')

.controller('HomeController',
    ['$scope', '$rootScope', '$location','sharedStateService', 'Page',
    function ($scope, $rootScope, $location, sharedStateService, Page) {
        $scope.Page = Page;
        $scope.Page.setTitle("New Hardware Order");
        $scope.user = $rootScope.globals.currentUser.username;
        $scope.userrole = $rootScope.globals.currentUser.role;
        $scope.serverInfo = $rootScope.kieServer;
        $scope.date = new Date();
        $scope.selectedType = "";

        if($scope.userrole == "Manager") {
            $location.path("/managertasks");
        }
        if($scope.userrole == "Supplier") {
            $location.path("/suppliertasks");
        }

        $scope.go = function ( path ) {
            $location.path( path );
          };


          $scope.selectType = function(type) {
            $scope.selectedType = type;
            sharedStateService.setSelectedType(type);
          };
    }])

.controller('HeaderController',
        ['$scope', '$rootScope', '$location',
            function ($scope, $rootScope, $location)  {
                $scope.isActive = function (viewLocation) {
                    return viewLocation === $location.path();
                }
    }]);
