'use strict';

angular.module('InstanceDiagrams')
        .controller('InstanceDiagramsController',
        ['$scope', '$sce', '$rootScope', '$location', 'InstanceDiagramsService', 'sharedStateService', 'appConfig',
            function ($scope, $sce, $rootScope, $location, InstanceDiagramsService, sharedStateService, appConfig) {
                $scope.user = $rootScope.globals.currentUser.username;

                    InstanceDiagramsService.GetProcessInstances(appConfig.get('kieserver_url'), function (response) {

                        if (response.success) {
                            $scope.processInstances = response.data;
                            //$location.path('/managertasks');
                        } else {
                            $scope.error = response.message;
                            $scope.dataLoading = false;
                        }
                    });

                $scope.displayProcessInstance = function() {

                    InstanceDiagramsService.GetInstanceSVG(appConfig.get('kieserver_url'), $scope.selectedInstance, function (response) {

                        if (response.success) {
                            $scope.processInstanceSVG = $sce.trustAsHtml(response.data);
                            //$location.path('/managertasks');
                        } else {
                            $scope.error = response.message;
                            $scope.dataLoading = false;
                        }
                    });
                }

            }]);

