'use strict';

angular.module('Cases')

.factory('CasesService',
    ['KieServerInfoService', '$http', '$rootScope',
    function (KieServerInfoService, $http, $rootScope) {
        var service = {};

        service.GetDefinitions = function (callback) {

            $http({method: 'GET', url: KieServerInfoService.data.kieServer.location+"/queries/cases"}).
                    success(function(data, status, headers, config) {
                        var response = { success: status == 200, message : status, data : data['definitions']};
                        callback(response);
                    }).
                    error(function(data, status, headers, config) {

                        var response = { success: false, message : status};
                        callback(response);
                    });
        };



        return service;
    }]);
