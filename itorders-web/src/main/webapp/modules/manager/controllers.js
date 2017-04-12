'use strict';

angular.module('Manager')
.controller('ManagerTaskController',
    ['$scope', '$rootScope', '$location', 'ManagerService', 'sharedStateService', 'appConfig', 'Page',
        function ($scope, $rootScope, $location, ManagerService, sharedStateService, appConfig, Page) {
            $scope.user = $rootScope.globals.currentUser.username;
            $scope.orderNumber = "";
            $scope.taskId = "";
            $scope.page = 0;
            $scope.pageSize = appConfig.get('page_size');
            $scope.prevButtonStyle = "display:none";
            $scope.nextButtonStyle = "";
            $scope.Page = Page;
            $scope.Page.setTitle("Pending Approvals");

            ManagerService.GetTasks(appConfig.get('kieserver_url'), $scope.page, $scope.pageSize, function (response) {

                if (response.success) {
                    $scope.tasks = response.data;
                    $location.path('/managertasks');
                } else {
                    $scope.error = response.message;
                    $scope.dataLoading = false;
                }
            });

            $scope.selected = function(taskId) {

                $scope.taskId = taskId;
            }

            $scope.reload = function(taskId) {

                ManagerService.GetTasks(appConfig.get('kieserver_url'), $scope.page, $scope.pageSize, function (response) {

                    if (response.success) {
                        $scope.tasks = response.data;
                    } else {
                        $scope.error = response.message;
                        $scope.dataLoading = false;
                    }
                });
            }

            $scope.approve = function() {
                var data = {
                    "managerComment_" : $scope.approveComment,
                    "approved_" : true,
                    "approved" : true,
                    "caseFile_managerComment" : $scope.approveComment,
                    "caseFile_managerDecision" : true
                };
                
                ManagerService.CompleteTask(appConfig.get('kieserver_url'), $scope.taskId, data, function (response) {

                    if (response) {
                        $scope.reload();
                    } else {
                        $scope.error = response.message;
                        $scope.dataLoading = false;
                    }
                });
            };

            $scope.reject = function() {
                var data = {
                    "managerComment_" : $scope.rejectComment,
                    "approved_" : false,
                    "approved" : false,
                    "caseFile_managerComment" : $scope.rejectComment,
                    "caseFile_managerDecision" : false
                };
                ManagerService.CompleteTask(appConfig.get('kieserver_url'), $scope.taskId, data, function (response) {

                    if (response) {
                        $scope.reload();
                    } else {
                        $scope.error = response.message;
                        $scope.dataLoading = false;
                    }
                });
            };

            $scope.prevPage = function() {
                $scope.page = $scope.page - 1;
                if ($scope.page == 0) {
                    $scope.prevButtonStyle = "display:none";
                }
                ManagerService.GetTasks(appConfig.get('kieserver_url'), $scope.page, $scope.pageSize, function (response) {

                    if (response.success) {
                        $scope.tasks = response.data;
                        $scope.nextButtonStyle = "";

                    } else {
                        $scope.error = response.message;
                        $scope.dataLoading = false;
                    }
                });
            };

            $scope.nextPage = function() {
                $scope.page = $scope.page + 1;
                if ($scope.page > 0) {
                    $scope.prevButtonStyle = "";
                }
                ManagerService.GetTasks(appConfig.get('kieserver_url'), $scope.page, $scope.pageSize, function (response) {

                    if (response.success) {
                        $scope.tasks = response.data;
                        if ($scope.tasks.length < $scope.pageSize) {
                            $scope.nextButtonStyle = "display:none";
                        }
                    } else {
                        $scope.error = response.message;
                        $scope.dataLoading = false;
                    }
                });
            };

    }]);
