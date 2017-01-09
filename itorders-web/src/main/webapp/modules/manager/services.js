'use strict';

angular.module('Manager')

.factory('ManagerService',
    ['$http', '$rootScope',
    function ($http, $rootScope) {
        var service = {};

        service.GetTasks = function (serverUrl, page, pageSize, callback) {

            $http({method: 'GET', url: serverUrl + "/queries/tasks/instances/pot-owners?page=" + page + "&pageSize=" + pageSize + "&filter=Manager approval"}).
                    success(function(data, status, headers, config) {
                        var response = { success: status == 200, message : status, data : data['task-summary']};
                        callback(response);
                    }).
                    error(function(data, status, headers, config) {

                        var response = { success: false, message : status};
                        callback(response);
                    });
        };

        service.CompleteTask = function (serverUrl, taskId, data, callback) {

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
