'use strict';

angular.module('Orders')

.factory('OrderService',
    ['$http', '$rootScope',
    function ($http, $rootScope) {
        var service = {};

        service.initOrder = function (serverUrl, owner, manager, supplier, callback) {
            var data = {
              "case-data" : {
              },
              "case-user-assignments" : {
                "owner" : owner,
                "manager" : manager.id
              },
              "case-group-assignments" : {
                "supplier" : supplier.id
             }
            };

            $http({method: 'POST', url: serverUrl + "/containers/itorders/cases/itorders.orderhardware/instances",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
                data : data}).
                    success(function(data, status, headers, config) {
                        var response = { success: status == 201, message : status, data : data};

                        callback(response);
                    }).
                    error(function(data, status, headers, config) {

                        var response = { success: false, message : status};
                        callback(response);
                    });
        };

        service.GetInstances = function (serverUrl, page, pageSize, callback) {

            $http({method: 'GET', url: serverUrl + "/queries/cases/instances?page=" + page + "&pageSize=" + pageSize}).
                    success(function(data, status, headers, config) {
                        var response = { success: status == 200, message : status, data : data['instances']};
                        callback(response);
                    }).
                    error(function(data, status, headers, config) {

                        var response = { success: false, message : status};
                        callback(response);
                    });
        };
        
        service.GetMyInstances = function (serverUrl, owner, page, pageSize, callback) {

            $http({method: 'GET', url: serverUrl + "/queries/cases/instances?page=" + page + "&pageSize=" + pageSize + "&owner=" + owner}).
                    success(function(data, status, headers, config) {
                        var response = { success: status == 200, message : status, data : data['instances']};
                        callback(response);
                    }).
                    error(function(data, status, headers, config) {

                        var response = { success: false, message : status};
                        callback(response);
                    });
        };

        service.GetInstance = function (serverUrl, caseId, callback) {

            $http({method: 'GET', url: serverUrl + "/containers/itorders/cases/instances/" + caseId + "?withMilestones=true&withRoles=true&withData=true"}).
                    success(function(data, status, headers, config) {
                        var response = { success: status == 200, message : status, data : data};
                        callback(response);
                    }).
                    error(function(data, status, headers, config) {

                        var response = { success: false, message : status};
                        callback(response);
                    });
        };

        service.GetTasksForOrder = function (serverUrl, orderNumber, page, pageSize, callback) {

            $http({method: 'GET', url: serverUrl + "/queries/cases/instances/" + orderNumber + "/tasks/instances/pot-owners?page=" + page + "&pageSize=" + pageSize}).
                    success(function(data, status, headers, config) {
                        var response = { success: status == 200, message : status, data : data['task-summary']};
                        callback(response);
                    }).
                    error(function(data, status, headers, config) {

                        var response = { success: false, message : status};
                        callback(response);
                    });
        };

        service.GetComments = function (serverUrl, orderNumber, callback) {

            $http({method: 'GET', url: serverUrl + "/containers/itorders/cases/instances/" + orderNumber + "/comments"}).
                    success(function(data, status, headers, config) {

                        var response = { success: status == 200, message : status, data : data['comments']};
                        callback(response);
                    }).
                    error(function(data, status, headers, config) {

                        var response = { success: false, message : "" + data};
                        callback(response);
                    });    
        };

        service.addComment = function (serverUrl, orderNumber, commentText, callback) {


            $http({method: 'POST', url: serverUrl + "/containers/itorders/cases/instances/" + orderNumber + "/comments",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
                data : '"' + commentText + '"'}).
                    success(function(data, status, headers, config) {
                        var response = { success: status == 201, message : status, data : data};

                        callback(response);
                    }).
                    error(function(data, status, headers, config) {

                        var response = { success: false, message : status};
                        callback(response);
                    });
        };

        service.DeleteComment = function (serverUrl, orderNumber, commentId, callback) {


            $http({method: 'DELETE', url: serverUrl + "/containers/itorders/cases/instances/" + orderNumber + "/comments/"+commentId}).
                    success(function(status, headers, config) {

                        callback(true);
                    }).
                    error(function(data, status, headers, config) {

                        var response = { success: false, message : status};
                        callback(response);
                    });
        };

        service.UpdateComment = function (serverUrl, orderNumber, commentId, commentText, callback) {


            $http({method: 'PUT', url: serverUrl + "/containers/itorders/cases/instances/" + orderNumber + "/comments/"+commentId,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
                data : '"' + commentText + '"'}).
                    success(function(status, headers, config) {

                        callback(true);
                    }).
                    error(function(data, status, headers, config) {

                        var response = { success: false, message : status};
                        callback(response);
                    });
        };
        
        service.GetMilestonesForOrder = function (serverUrl, orderNumber, callback) {

            $http({method: 'GET', url: serverUrl + "/containers/itorders/cases/instances/" + orderNumber + "/milestones?achievedOnly=true"}).
                    success(function(data, status, headers, config) {
                        var response = { success: status == 200, message : status, data : data['milestones']};
                        callback(response);
                    }).
                    error(function(data, status, headers, config) {

                        var response = { success: false, message : status};
                        callback(response);
                    });
        };

        service.CloseCase = function (serverUrl, orderNumber, callback) {


            $http({method: 'DELETE', url: serverUrl + "/containers/itorders/cases/instances/" + orderNumber}).
                    success(function(status, headers, config) {
                    	var response = { success: true};
                        callback(response);
                    }).
                    error(function(data, status, headers, config) {
                    	
                        var response = { success: false, message : "" + data};
                        callback(response);
                    });
        };
        
        service.PutCaseData = function (serverUrl, orderNumber, name, value, callback) {

            $http({method: 'POST', url: serverUrl + "/containers/itorders/cases/instances/" + orderNumber + "/caseFile/"+name,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
                data :  value }).
                    success(function(status, headers, config) {

                        callback(true);
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
        
        service.CompleteSurvey = function (serverUrl, taskId, survey, callback) {

        	var data = {
                    "survey_" : {
                    	"Survey" : survey
                    }
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
        
        service.requestManagerApproval = function (serverUrl, requestor, orderNumber, callback) {
            var data = {
            		"name" : "Manager approval",
            		"description" : "Additional request for approval of " + orderNumber,
            		"actors" : "manager",
            		"data": {           
		              "orderNumber" : orderNumber,
		              "requestor" : requestor
		            }
            };

            $http({method: 'POST', url: serverUrl + "/containers/itorders/cases/instances/" + orderNumber + "/tasks",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
                data : data}).
                    success(function(data, status, headers, config) {
                        var response = { success: status == 201, message : status, data : data};

                        callback(response);
                    }).
                    error(function(data, status, headers, config) {

                        var response = { success: false, message : status};
                        callback(response);
                    });
        };
        
        return service;
    }]);
