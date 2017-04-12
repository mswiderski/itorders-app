'use strict';

angular.module('Orders')

.controller('OrderController',
    ['$scope', '$rootScope', '$location', 'OrderService', 'sharedStateService', 'appConfig', 'ModalService',
        function ($scope, $rootScope, $location, OrderService, sharedStateService, appConfig, ModalService) {
            $scope.user = $rootScope.globals.currentUser.username;
            $scope.ownerInput = $rootScope.globals.currentUser.username;
            $scope.suppliers = appConfig.get('suppliers');
            //var index = $scope.suppliers.map(function(e) { return e.id; }).indexOf(sharedStateService.getSelectedType());
            $scope.supplierInput;
            $scope.managers = appConfig.get('managers');

            $scope.submitOrder = function() {
                $scope.supplierInput = $scope.suppliers[sharedStateService.getIndex()];
                OrderService.initOrder(appConfig.get('kieserver_url'), $scope.ownerInput,
                    $scope.managerInput,
                    $scope.supplierInput, function (response) {

                    if (response.success) {
                        var caseId = response.data;

                        OrderService.GetInstance(appConfig.get('kieserver_url'), caseId, function (response2) {

                            if (response.success) {
                                $rootScope.order = response2.data;

                                ModalService.showModal({
                                    templateUrl: "modules/order/views/order-confirmation-modal.html",
                                    controller: "SimpleModalController"
                                }).then(function(modal) {
                                    modal.element.modal();
                                    modal.close.then(function(result) {
                                        $location.path('/listmyorders');
                                    });
                                });
                            } else {
                                $scope.error = response.message;
                                $scope.dataLoading = false;
                            }
                        });

                    } else {
                        $scope.error = response.message;
                        $scope.dataLoading = false;
                    }
                });
            };

            $scope.collectMyOrders = function() {

                OrderService.GetInstances(appConfig.get('kieserver_url'), $scope.page, $scope.pageSize, function (response) {

                    if (response.success) {
                        $scope.instances = response.data;
                        $location.path('/listorders');
                    } else {
                        $scope.error = response.message;
                        $scope.dataLoading = false;
                    }
                });
            }
    }])
.controller('ListOrdersController',
        ['$scope', '$rootScope', '$location', 'OrderService', 'appConfig', 'Page',
            function ($scope, $rootScope, $location, OrderService, appConfig, Page) {
                $scope.Page = Page;
                $scope.Page.setTitle("Hardware Orders");
                $scope.user = $rootScope.globals.currentUser.username;
                $scope.comment = "";
                $scope.orderNumber = "";
                $scope.page = 0;
                $scope.pageSize = appConfig.get('page_size');
                $scope.prevButtonStyle = "display:none";
                $scope.nextButtonStyle = "";

                OrderService.GetInstances(appConfig.get('kieserver_url'), $scope.page, $scope.pageSize, function (response) {

                    if (response.success) {
                        $scope.orders = response.data;
                        $location.path('/listorders');
                    } else {
                        $scope.error = response.message;
                        $scope.dataLoading = false;
                    }
                });

                $scope.addComment = function() {

                    OrderService.addComment(appConfig.get('kieserver_url'), $scope.orderNumber, $scope.comment, function (response) {

                        if (response.success) {
                            
                        } else {
                            $scope.error = response.message;
                            $scope.dataLoading = false;
                        }
                    });
                }

                $scope.closeOrder = function(orderNumber) {

                    OrderService.CloseCase(appConfig.get('kieserver_url'), orderNumber, function (response) {

                        if (response) {
                            OrderService.GetInstances(appConfig.get('kieserver_url'), $scope.page, $scope.pageSize, function (response) {

                                if (response.success) {
                                    $scope.orders = response.data;                                    
                                } else {
                                    $scope.error = response.message;
                                    $scope.dataLoading = false;
                                }
                            });
                        } else {
                            $scope.error = response.message;
                            $scope.dataLoading = false;
                        }
                    });
                }

                $scope.selected = function(orderNumber) {
                    $scope.orderNumber = orderNumber;
                    $scope.orderDetailsURL = "modules/order/views/order-details.html?date="+Date.now();
                }

                $scope.getSelected = function() {
                    return $scope.orderNumber;
                }

                $scope.goWithSelected = function (orderNumber, path ) {
                    $scope.orderNumber = orderNumber;
                    $location.path( path + "/" + orderNumber );
                  };
              $scope.prevPage = function() {
                  $scope.page = $scope.page - 1;
                  if ($scope.page == 0) {
                      $scope.prevButtonStyle = "display:none";
                  }
                  OrderService.GetInstances(appConfig.get('kieserver_url'), $scope.page, $scope.pageSize, function (response) {

                      if (response.success) {
                          $scope.orders = response.data;
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
                  OrderService.GetInstances(appConfig.get('kieserver_url'), $scope.page, $scope.pageSize, function (response) {

                      if (response.success) {
                          $scope.orders = response.data;
                          if ($scope.orders.length < $scope.pageSize) {
                              $scope.nextButtonStyle = "display:none";
                          }
                      } else {
                          $scope.error = response.message;
                          $scope.dataLoading = false;
                      }
                  });
              };
        }])
        
.controller('OrderSurveyController',
    ['$scope', '$rootScope', '$routeParams', '$location', 'OrderService', 'sharedStateService', 'appConfig', 'Page',
        function ($scope, $rootScope, $routeParams, $location, OrderService, sharedStateService, appConfig, Page) {
            $scope.user = $rootScope.globals.currentUser.username;     
            $scope.survey = {};
            $scope.Page = Page;
            $scope.Page.setTitle("Delivery Satisfaction Survey");
            
            OrderService.ClaimAndGetTask(appConfig.get('kieserver_url'), $routeParams.surveyId, function (response) {

                if (response.success) {
                	$scope.task = response.data;
                	
                    $location.path('/order/tasks/Customer_satisfcation_survey/'+ $routeParams.surveyId);
                } else {
                    $scope.error = response.message;
                    $scope.dataLoading = false;
                }
            });
            
            $scope.completeSurvey = function() {
            	
            	OrderService.CompleteSurvey(appConfig.get('kieserver_url'), $scope.task['task-id'], $scope.survey, function (response) {

                    if (response) {
                        //$location.path('/orders/' + $scope.task['task-input-data']['orderNumber']);
                        $location.path('/listmyorders');
                    } else {
                        $scope.error = response.message;
                        $scope.dataLoading = false;
                    }
                });
            };
    }]) 
    
.controller('ListMyOrdersController',
        ['$scope', '$rootScope', '$location', 'OrderService', 'appConfig', 'Page',
            function ($scope, $rootScope, $location, OrderService, appConfig, Page) {
                $scope.Page = Page;
                $scope.Page.setTitle("My Hardware Orders");
                $scope.user = $rootScope.globals.currentUser.username;
                $scope.comment = "";
                $scope.orderNumber = "";
                $scope.page = 0;
                $scope.pageSize = appConfig.get('page_size');
                $scope.prevButtonStyle = "display:none";
                $scope.nextButtonStyle = "";

                OrderService.GetMyInstances(appConfig.get('kieserver_url'), $scope.user, $scope.page, $scope.pageSize, function (response) {

                    if (response.success) {
                        $scope.orders = response.data;
                        $location.path('/listmyorders');
                    } else {
                        $scope.error = response.message;
                        $scope.dataLoading = false;
                    }
                });

                $scope.addComment = function() {

                    OrderService.addComment(appConfig.get('kieserver_url'), $scope.orderNumber, $scope.comment, function (response) {

                        if (response.success) {
                            
                        } else {
                            $scope.error = response.message;
                            $scope.dataLoading = false;
                        }
                    });
                }

                $scope.closeOrder = function(orderNumber) {

                    OrderService.CloseCase(appConfig.get('kieserver_url'), orderNumber, function (response) {

                        if (response) {
                            OrderService.GetInstances(appConfig.get('kieserver_url'), $scope.page, $scope.pageSize, function (response) {

                                if (response.success) {
                                    $scope.orders = response.data;                                    
                                } else {
                                    $scope.error = response.message;
                                    $scope.dataLoading = false;
                                }
                            });
                        } else {
                            $scope.error = response.message;
                            $scope.dataLoading = false;
                        }
                    });
                }

                $scope.selected = function(orderNumber) {
                    $scope.orderNumber = orderNumber;
                    $scope.orderDetailsURL = "modules/order/views/order-details.html?date="+Date.now();
                }

                $scope.getSelected = function() {
                    return $scope.orderNumber;
                }

                $scope.goWithSelected = function (orderNumber, path ) {
                    $scope.orderNumber = orderNumber;
                    $location.path( path + "/" + orderNumber );
                  };
              $scope.prevPage = function() {
                  $scope.page = $scope.page - 1;
                  if ($scope.page == 0) {
                      $scope.prevButtonStyle = "display:none";
                  }
                  OrderService.GetInstances(appConfig.get('kieserver_url'), $scope.page, $scope.pageSize, function (response) {

                      if (response.success) {
                          $scope.orders = response.data;
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
                  OrderService.GetInstances(appConfig.get('kieserver_url'), $scope.page, $scope.pageSize, function (response) {

                      if (response.success) {
                          $scope.orders = response.data;
                          if ($scope.orders.length < $scope.pageSize) {
                              $scope.nextButtonStyle = "display:none";
                          }
                      } else {
                          $scope.error = response.message;
                          $scope.dataLoading = false;
                      }
                  });
              };
        }])    
        
.controller('OrderDetailsController',
        ['$scope', '$rootScope', '$route', '$routeParams', '$location', 'OrderService', 'appConfig',
            function ($scope, $rootScope, $route, $routeParams, $location, OrderService, appConfig) {
                $scope.user = $rootScope.globals.currentUser.username;
                $scope.page = 0;
                $scope.pageSize = appConfig.get('page_size');
                $scope.prevButtonStyle = "display:none";
                $scope.nextButtonStyle = "";
                $scope.commentText = "";
                $scope.orderNumber = "";
                $scope.errorMessage = null;

                $scope.initOrderService = function() {OrderService.GetInstance(appConfig.get('kieserver_url'), $scope.orderNumber, function (response) {
                    if (response.success) {
                        $scope.order = response.data;
                        if ($scope.order['case-file'] != null && $scope.order['case-file']['case-data']['hwSpec'] != null) {
                            $scope.hardwareSpec = $scope.order['case-file']['case-data']['hwSpec']['org.jbpm.document.service.impl.DocumentImpl'];
                            $scope.downloadLink = appConfig.get('kieserver_url') + "/documents/" +$scope.hardwareSpec.identifier + "/content";
                        }
                        if ($scope.order['case-file'] != null && $scope.order['case-file']['case-data']['supplierComment'] != null) {
                            $scope.supplierComment = $scope.order['case-file']['case-data']['supplierComment'];
                        } 
                        if ($scope.order['case-file'] != null && $scope.order['case-file']['case-data']['managerDecision'] != null) {
                            $scope.managerDecision = $scope.order['case-file']['case-data']['managerDecision'];
                        }
                        if ($scope.order['case-file'] != null && $scope.order['case-file']['case-data']['managerComment'] != null) {
                            $scope.managerComment = $scope.order['case-file']['case-data']['managerComment'];
                        }
                        
                        OrderService.GetMilestonesForOrder(appConfig.get('kieserver_url'), $scope.orderNumber, function (response) {

                            if (response.success) {
                                
                                $scope.milestones = new Map();
                                response.data.forEach( function(mi) {                                 	
                                	$scope.milestones.set(mi['milestone-name'], mi['milestone-achieved-at'])  
                               } );
                                
                                //$location.path('/orders/'+$routeParams.orderNumber);
                            } else {
                                $scope.error = response.message;
                                $scope.dataLoading = false;
                            }
                        });
                    } else {
                        $scope.error = response.message;
                        $scope.dataLoading = false;
                    }
                })};

                $scope.milestoneClass = function(milestone) {
                    if (milestone['milestone-achieved'] == true) {
                        return "collapsed";
                    }

                    return "";
                }

                $scope.showComments = function() {
                    OrderService.GetComments(appConfig.get('kieserver_url'), $scope.order['case-id'], function (response) {

                        if (response.success) {
                            $scope.comments = response.data;
                        } else {
                            $scope.errorMessageComment = response.message;
                        }
                    });
                };

                $scope.showTasks = function() {

                    OrderService.GetTasksForOrder(appConfig.get('kieserver_url'), $scope.order['case-id'], $scope.page, $scope.pageSize, function (response) {

                        if (response.success) {
                            $scope.tasks = response.data;
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
                    OrderService.GetTasksForOrder(appConfig.get('kieserver_url'), $scope.order['case-id'], $scope.page, $scope.pageSize, function (response) {

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
                    OrderService.GetTasksForOrder(appConfig.get('kieserver_url'), $scope.order['case-id'], $scope.page, $scope.pageSize, function (response) {

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

                $scope.selected = function(orderNumber) {
                    $scope.orderNumber = orderNumber;
                    $scope.newcomment = {};
                    $scope.initOrderService();
                }
                
                $scope.go = function ( path, taskId ) {
                	path=path.replace(/\s+/g,"_");
                	
                    $location.path( '/order/tasks/'+path+'/'+taskId );
                  };

                $scope.editComment = function(orderNumber, comment) {
                    $scope.orderNumber = orderNumber;
                    $scope.comment = comment;
                }

                $scope.addComment = function() {

                    OrderService.addComment(appConfig.get('kieserver_url'), $scope.orderNumber, $scope.newcomment.text, function (response) {

                        if (response.success) {
                            $scope.newcomment = {};
                            $scope.showComments();

                        } else {
                            $scope.error = response.message;
                            $scope.dataLoading = false;
                        }
                    });
                }

                $scope.saveComment = function() {

                    OrderService.UpdateComment(appConfig.get('kieserver_url'), $scope.orderNumber, $scope.comment.id, $scope.comment.text, function (response) {

                        if (response) {
                            $scope.showComments();
                        } else {
                            $scope.error = response.message;
                            $scope.dataLoading = false;
                        }
                    });
                }

                $scope.deleteComment = function(orderNumber, commentId) {

                    OrderService.DeleteComment(appConfig.get('kieserver_url'), orderNumber, commentId, function (response) {

                        if (response) {
                            $scope.showComments();
                        } else {
                            $scope.error = response.message;
                            $scope.dataLoading = false;
                        }
                    });
                }

                $scope.closeOrder = function(orderNumber) {

                    OrderService.CloseCase(appConfig.get('kieserver_url'), orderNumber, function (response) {

                        if (response.success) {
                            //$location.path('/listorders');
                            $route.reload();
                        } else {
                            $scope.errorMessage = response.message;                            
                        }
                    });
                }
                
                $scope.shipOrder = function(orderNumber) {

                    OrderService.PutCaseData(appConfig.get('kieserver_url'), orderNumber, "shipped", true, function (response) {

                        if (response) {
                        	OrderService.GetMilestonesForOrder(appConfig.get('kieserver_url'), $scope.orderNumber, function (response) {

                                if (response.success) {
                                    
                                    $scope.milestones = new Map();
                                    response.data.forEach( function(mi) {                                 	
                                    	$scope.milestones.set(mi['milestone-name'], mi['milestone-achieved-at'])  
                                   } );
                                    
                                    //$location.path('/orders/'+$routeParams.orderNumber);
                                } else {
                                    $scope.error = response.message;
                                    $scope.dataLoading = false;
                                }
                            });
                        } else {
                            $scope.error = response.message;
                            $scope.dataLoading = false;
                        }
                    });
                }
                
                $scope.deliverOrder = function(orderNumber) {

                    OrderService.PutCaseData(appConfig.get('kieserver_url'), orderNumber, "delivered", true, function (response) {

                        if (response) {
                        	OrderService.GetMilestonesForOrder(appConfig.get('kieserver_url'), $scope.orderNumber, function (response) {

                                if (response.success) {
                                    
                                    $scope.milestones = new Map();
                                    response.data.forEach( function(mi) {                                 	
                                    	$scope.milestones.set(mi['milestone-name'], mi['milestone-achieved-at'])  
                                   } );
                                    
                                    //$location.path('/orders/'+$routeParams.orderNumber);
                                } else {
                                    $scope.error = response.message;
                                    $scope.dataLoading = false;
                                }
                            });
                        } else {
                            $scope.error = response.message;
                            $scope.dataLoading = false;
                        }
                    });
                }
                
                $scope.requestManagerApproval = function(orderNumber) {
                    OrderService.requestManagerApproval(appConfig.get('kieserver_url'), $scope.user, orderNumber, function (response) {

                        if (response) {
                        	//$location.path('/orders/'+$routeParams.orderNumber);
                            $route.reload();
                        } else {
                            $scope.error = response.message;
                            $scope.dataLoading = false;
                        }
                    });
                }
        }])


    .controller('SimpleModalController', ['$scope', 'close', function($scope, close) {

        $scope.close = function(result) {
            close(result, 500);
        };

    }]);
