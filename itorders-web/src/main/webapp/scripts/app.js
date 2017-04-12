'use strict';

// declare modules
angular.module('Authentication', []);
angular.module('Home', []);
angular.module('Cases', []);
angular.module('Orders', []);
angular.module('Supplier', []);
angular.module('Manager', []);
angular.module('InstanceDiagrams', []);

angular.module('OrderITApplication', [
    'ngRoute',
    'ngCookies',
    'angularModalService',
    'Authentication',
    'Home',
    'Cases',
    'Orders',
    'Supplier',
    'Manager',
    'InstanceDiagrams'
])

 .filter("asDate", function () {
        return function (input) {
            return new Date(input);
        }
    })

    .filter('capitalize', function() {
        return function(input) {
            return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
        }
    })

.config(['$routeProvider', function ($routeProvider) {

    $routeProvider
        .when('/login', {
            controller: 'LoginController',
            templateUrl: 'modules/authentication/views/login.html'
        })

        .when('/neworder', {
            controller: 'OrderController',
            templateUrl: 'modules/order/views/start-order.html'
        })

        .when('/orderconfirmation', {
            controller: 'OrderController',
            templateUrl: 'modules/order/views/order-confirmation.html'
        })

        .when('/orders/:orderNumber', {
            controller: 'OrderDetailsController',
            templateUrl: 'modules/order/views/order-details.html'
        })
        
        .when('/order/tasks/Customer_satisfcation_survey/:surveyId', {
            controller: 'OrderSurveyController',
            templateUrl: 'modules/order/views/survey-details.html'
        })

        .when('/listorders', {
            controller: 'ListOrdersController',
            templateUrl: 'modules/order/views/list-orders.html'
        })
        
        .when('/listmyorders', {
            controller: 'ListMyOrdersController',
            templateUrl: 'modules/order/views/list-my-orders.html'
        })

        .when('/managertasks', {
            controller: 'ManagerTaskController',
            templateUrl: 'modules/manager/views/list-tasks.html'
        })

        .when('/suppliertasks', {
            controller: 'SupplierTaskController',
            templateUrl: 'modules/supplier/views/list-tasks.html'
        })
        
        .when('/orderstoplace', {
            controller: 'SupplierOrderTaskController',
            templateUrl: 'modules/supplier/views/list-orders.html'
        })
        
        .when('/placeorder/:orderTaskId', {
            controller: 'SupplierOrderDetailsController',
            templateUrl: 'modules/supplier/views/place-order.html'
        })

        .when('/hardwarespec/:taskId', {
            controller: 'HardwareSpecController',
            templateUrl: 'modules/supplier/views/hardware-spec.html'
        })

        .when('/processinstancediagrams', {
            controller: 'InstanceDiagramsController',
            templateUrl: 'modules/processinstancediagrams/views/processinstancediagrams.html'
        })

        .when('/', {
            controller: 'HomeController',
            templateUrl: 'modules/home/views/home.html'
        })

        .otherwise({ redirectTo: '/login' });
}])
.service('sharedStateService', ['appConfig', function(appConfig) {
            var selectedType;
            var index;

            return {
                getSelectedType: function() {
                    return selectedType;
                },
                setSelectedType: function(value) {
                    selectedType = value;
                    index = appConfig.get('suppliers').map(function(e) { return e.id; }).indexOf(value);
                },
                getIndex: function() {
                    return index;
                }
            };
        }])
.factory("appConfig", function() {
    return {
        get: function(name) {
            return application[name];
        }
    }
})
.run(['$rootScope', '$location', '$cookieStore', '$http',
    function ($rootScope, $location, $cookieStore, $http) {
        // keep user logged in after page refresh
        $rootScope.globals = $cookieStore.get('globals') || {};
        if ($rootScope.globals.currentUser) {
            $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata; // jshint ignore:line
        }

        $rootScope.currentLocaton = $location.path();

        $http.defaults.headers.common['Accept'] = 'application/json';
        $http.defaults.headers.common['Content-Type'] = 'application/json';
        $rootScope.$on('$locationChangeStart', function (event, next, current) {
            $rootScope.currentLocaton = $location.path();
            // redirect to login page if not logged in
            if ($location.path() !== '/login' && !$rootScope.globals.currentUser) {
                $location.path('modules/authentication/views/login.html');
            }
        });
    }])

    .directive('restrict', ['$rootScope', function($rootScope){
        return {
            restrict: 'A',
            prioriry: 100000,
            scope: false,
            link: function(){
            },
            compile:  function(element, attr, linker){
                var accessDenied = true;
                var userrole = $rootScope.globals.currentUser.role;

                if(attr.access == userrole) {
                    accessDenied = false;
                }
                if(accessDenied){
                    element.children().remove();
                    element.remove();
                }

            }
        }
    }])

    .directive('excludeForLocation', ['$rootScope', '$location', function($rootScope, $location){
        return {
            restrict: 'A',
            prioriry: 100000,
            scope: false,
            link: function(){
            },
            compile:  function(element, attr, linker){
                var accessDenied = true;
                var location = $location.path();

                if(attr.url != location) {
                    accessDenied = false;
                }
                if(accessDenied){
                    element.children().remove();
                    element.remove();
                }

            }
        }
    }])

    .factory('Page', function(){
        var title = 'Home';
        return {
            title: function() { return title; },
            setTitle: function(newTitle) { title = newTitle; }
        };
    });