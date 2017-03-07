'use strict';

angular.module('InstanceDiagrams')

        .factory('InstanceDiagramsService',
        ['$http', '$rootScope',
            function ($http, $rootScope) {
                var service = {};

                service.GetProcessInstances = function (serverUrl, callback) {

                    $http({method: 'GET', url: serverUrl + "/queries/processes/instances"}).
                            success(function(data, status, headers, config) {
                                var response = { success: status == 200, message : status, data : data};
                                callback(response);
                            }).
                            error(function(data, status, headers, config) {
                                var response = { success: false, message : status};
                                callback(response);
                            });
                };

                service.GetInstanceSVG = function (serverUrl, instanceInfo, callback) {

                    $http({method: 'GET',
                        url: serverUrl + "/containers/itorders/images/processes/instances/" + instanceInfo['process-instance-id'],
                        headers: {
                            'Content-Type': 'application/svg+xml',
                            'Accept': 'application/svg+xml'
                        }}).
                            success(function(data, status, headers, config) {
                                var response = { success: status == 200, message : status, data : data};
                                callback(response);
                            }).
                            error(function(data, status, headers, config) {
                                var response = { success: false, message : status};
                                callback(response);
                            });
                };


                return service;
            }]);
