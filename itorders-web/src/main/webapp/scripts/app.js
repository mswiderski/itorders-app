'use strict';

// declare modules
angular.module('Authentication', []);
angular.module('Home', []);
angular.module('Cases', []);
angular.module('Orders', []);
angular.module('Supplier', []);
angular.module('Manager', []);

angular.module('OrderITApplication', [
    'ngRoute',
    'ngCookies',
    'Authentication',
    'Home',
    'Cases',
    'Orders',
    'Supplier',
    'Manager'

])

 .filter("asDate", function () {
        return function (input) {
            return new Date(input);
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

        .when('/', {
            controller: 'HomeController',
            templateUrl: 'modules/home/views/home.html'
        })

        .otherwise({ redirectTo: '/login' });
}])
.service('sharedStateService', function() {
            var selectedType;

            return {
                getSelectedType: function() {
                    return selectedType;
                },
                setSelectedType: function(value) {
                    selectedType = value;
                }
            };
        })
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


        $http.defaults.headers.common['Accept'] = 'application/json';
        $http.defaults.headers.common['Content-Type'] = 'application/json';
        $rootScope.$on('$locationChangeStart', function (event, next, current) {
            // redirect to login page if not logged in
            if ($location.path() !== '/login' && !$rootScope.globals.currentUser) {
                $location.path('modules/authentication/views/login.html');
            }
        });
    }]);
