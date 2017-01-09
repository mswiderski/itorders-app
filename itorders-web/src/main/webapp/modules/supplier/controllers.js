'use strict';

angular.module('Supplier')
.controller('SupplierTaskController',
    ['$scope', '$rootScope', '$location', 'SupplierService', 'sharedStateService', 'appConfig',
        function ($scope, $rootScope, $location, SupplierService, sharedStateService, appConfig) {
            $scope.user = $rootScope.globals.currentUser.username;
            $scope.page = 0;
            $scope.pageSize = appConfig.get('page_size');
            $scope.prevButtonStyle = "display:none";
            $scope.nextButtonStyle = "";

            $scope.go = function ( path ) {
                $location.path( path );
              };
            SupplierService.GetTasks(appConfig.get('kieserver_url'), $scope.page, $scope.pageSize, function (response) {

                if (response.success) {
                    $scope.tasks = response.data;
                    $location.path('/suppliertasks');
                } else {
                    $scope.error = response.message;
                    $scope.dataLoading = false;
                }
            });

            $scope.prevPage = function() {
                $scope.page = $scope.page - 1;
                if ($scope.page == 0) {
                    $scope.prevButtonStyle = "display:none";
                }
                SupplierService.GetTasks(appConfig.get('kieserver_url'), $scope.page, $scope.pageSize, function (response) {

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
                SupplierService.GetTasks(appConfig.get('kieserver_url'), $scope.page, $scope.pageSize, function (response) {

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

    }])
.controller('SupplierOrderTaskController',
    ['$scope', '$rootScope', '$location', 'SupplierService', 'sharedStateService', 'appConfig',
        function ($scope, $rootScope, $location, SupplierService, sharedStateService, appConfig) {
            $scope.user = $rootScope.globals.currentUser.username;
            $scope.page = 0;
            $scope.pageSize = appConfig.get('page_size');
            $scope.prevButtonStyle = "display:none";
            $scope.nextButtonStyle = "";

            $scope.go = function ( path ) {
                $location.path( path );
              };
            SupplierService.GetOrderTasks(appConfig.get('kieserver_url'), $scope.page, $scope.pageSize, function (response) {

                if (response.success) {
                    $scope.tasks = response.data;
                    $location.path('/orderstoplace');
                } else {
                    $scope.error = response.message;
                    $scope.dataLoading = false;
                }
            });

            $scope.prevPage = function() {
                $scope.page = $scope.page - 1;
                if ($scope.page == 0) {
                    $scope.prevButtonStyle = "display:none";
                }
                SupplierService.GetTasks(appConfig.get('kieserver_url'), $scope.page, $scope.pageSize, function (response) {

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
                SupplierService.GetTasks(appConfig.get('kieserver_url'), $scope.page, $scope.pageSize, function (response) {

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

    }]) 
    
.controller('SupplierOrderDetailsController',
    ['$scope', '$rootScope', '$routeParams', '$location', 'SupplierService', 'sharedStateService', 'appConfig',
        function ($scope, $rootScope, $routeParams, $location, SupplierService, sharedStateService, appConfig) {
            $scope.user = $rootScope.globals.currentUser.username;     
            $scope.orderInfo = '';
            
            SupplierService.ClaimAndGetTask(appConfig.get('kieserver_url'), $routeParams.orderTaskId, function (response) {

                if (response.success) {
                	$scope.task = response.data;
                	$scope.hardwareSpec = $scope.task['task-input-data']['_hwSpec']['org.jbpm.document.service.impl.DocumentImpl'];
                	$scope.downloadLink = appConfig.get('kieserver_url') + "/documents/" +$scope.hardwareSpec.identifier + "/content";
                    $location.path('/placeorder/'+ $routeParams.orderTaskId);
                } else {
                    $scope.error = response.message;
                    $scope.dataLoading = false;
                }
            });
            
            $scope.placeOrder = function() {
            	
            	SupplierService.CompletePlaceOrderTask(appConfig.get('kieserver_url'), $scope.task['task-id'], $scope.orderInfo, function (response) {

                    if (response) {
                        $location.path('/orderstoplace');
                    } else {
                        $scope.error = response.message;
                        $scope.dataLoading = false;
                    }
                });
            };
    }])       
    
.controller('HardwareSpecController',
    ['$scope', '$rootScope', '$routeParams', '$location', 'SupplierService', 'sharedStateService', 'appConfig',
        function ($scope, $rootScope, $routeParams, $location, SupplierService, sharedStateService, appConfig) {
            $scope.user = $rootScope.globals.currentUser.username;
            $scope.hardwareSpec = {};
            var srcData;
            SupplierService.ClaimAndGetTask(appConfig.get('kieserver_url'), $routeParams.taskId, function (response) {

                if (response.success) {
                    $scope.task = response.data;
                    $location.path('/hardwarespec/' + $routeParams.taskId);
                } else {
                    $scope.error = response.message;
                    $scope.dataLoading = false;
                }
            });

            $scope.add = function() {
              if (document.getElementById('file').files.length > 0) {
                var f = document.getElementById('file').files[0],
                r = new FileReader();

                $scope.hardwareSpec['name'] = f.name;
                $scope.hardwareSpec['size'] = f.size;
                r.onloadend = function(e){
                  var data = e.target.result;
                  srcData = data.replace(/^data:.*\/.*;base64,/, "");

                  SupplierService.CompleteTask(appConfig.get('kieserver_url'), $scope.task['task-id'], $scope.hardwareSpec, srcData, function (response) {

                      if (response) {
                          $location.path('/suppliertasks');
                      } else {
                          $scope.error = response.message;
                          $scope.dataLoading = false;
                      }
                  });
                }
                r.readAsDataURL(f);
            } else {
                console.log("No file attached, just form data " + $scope.hardwareSpec.type);
            }
           }

           $scope.complete = function() {
               $scope.add();
           };

           $scope.save = function() {
               $scope.add();
           };
    }]);
