'use strict';

angular.module('Supplier')

.factory('SupplierService',
    ['$http', '$rootScope',
    function ($http, $rootScope) {
        var service = {};

        service.GetTasks = function (serverUrl, page, pageSize, callback) {

            $http({method: 'GET', url: serverUrl + "/queries/tasks/instances/pot-owners?page=" + page + "&pageSize=" + pageSize + "&filter=Prepare hardware spec"}).
                    success(function(data, status, headers, config) {
                        var response = { success: status == 200, message : status, data : data['task-summary']};
                        callback(response);
                    }).
                    error(function(data, status, headers, config) {

                        var response = { success: false, message : status};
                        callback(response);
                    });
        };
        
        service.GetOrderTasks = function (serverUrl, page, pageSize, callback) {

            $http({method: 'GET', url: serverUrl + "/queries/tasks/instances/pot-owners?page=" + page + "&pageSize=" + pageSize + "&filter=Place order"}).
                    success(function(data, status, headers, config) {
                        var response = { success: status == 200, message : status, data : data['task-summary']};
                        callback(response);
                    }).
                    error(function(data, status, headers, config) {

                        var response = { success: false, message : status};
                        callback(response);
                    });
        };

        service.ClaimAndGetTask = function (serverUrl, taskId, callback) {
        	
            $http({method: 'GET', url: serverUrl + "/containers/itorders/tasks/" + taskId + "?withInputData=true"}).
                    success(function(data, status, headers, config) {
                        var response = { success: status == 200, message : status, data : data};

                        if (data['task-status'] == 'Ready') {
                            $http({method: 'PUT', url: serverUrl + "/containers/itorders/tasks/" + taskId + "/states/claimed"}).
                                    success(function(data, status, headers, config) {
                                        callback(response);

                                    }).
                                    error(function(data, status, headers, config) {

                                        console.error("Error when claiming task " + taskId + " status code " + status + " data " + data);
                                    });
                        } else {
                            callback(response);
                        }
                    }).
                    error(function(data, status, headers, config) {

                        var response = { success: false, message : status};
                        callback(response);
                    });
        };
        
        service.CompletePlaceOrderTask = function (serverUrl, taskId, orderInfo, callback) {

        	var data = {
                    "info_" : orderInfo,
                    "ordered_" : true
                  };

                  $http({method: 'PUT', url: serverUrl + "/containers/itorders/tasks/" + taskId + "/states/completed?auto-progress=true",
                  headers: {
                      'Content-Type': 'application/json',
                      'Accept': 'application/json'
                  },
                  data : data}).
                          success(function(status, headers, config) {
                              callback(true);

                          }).
                          error(function(data, status, headers, config) {

                              console.error("Error when claiming task " + taskId + " status code " + status + " data " + data);
                          });
        };
   

        service.CompleteTask = function (serverUrl, taskId, hardwareSpec, attachment, callback) {
            var data = {
              "hwSpec_" : {
                  "DocumentImpl" : {
                      "lastModified" : new Date(),
                      "name" : hardwareSpec.name,
                      "size" : hardwareSpec.size,
                      "content" : attachment
                  }
              },
              "supplierComment_" : hardwareSpec.comment
            };

            $http({method: 'PUT', url: serverUrl + "/containers/itorders/tasks/" + taskId + "/states/completed?auto-progress=true",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            data : data}).
                    success(function(status, headers, config) {

                        callback(true);

                    }).
                    error(function(data, status, headers, config) {
                        console.error("Error when claiming task " + taskId + " status code " + status + " data " + data);
                    });
                };
                
                
        return service;
    }]);
