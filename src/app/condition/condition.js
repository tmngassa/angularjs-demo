'use strict';

angular.module('bham.conditionModule',
        ['ngResource',
         'bham.conditionService',
         'bham.conditionDirectives',
         'bham.filters',
         'bham.naturalSort'
        ]
    )
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/patient/:patientId/conditions', {
                templateUrl: "condition/condition-list.tpl.html",
                controller: 'ConditionListCtrl',
                requireLogin: true,
                resolve: {
                    loadedConditions: ['ConditionService', '$log', '$q','$route', function(ConditionService, $log, $q, $route){
                        var patientId = $route.current.params.patientId;
                        if( ! isNaN(patientId)){
                            // Set up a promise to return
                            var deferred = $q.defer();
                            // Set up our resource calls
                            var conditionResource = ConditionService.getConditionResource();
                            var conditionData = conditionResource.query(
                                {patientId: patientId},
                                function(response){
                                },
                                function(error){
                                    $log.error(error.data.message );
                                    $log.error("Error message: " + error.data.message );
                                }
                            );
                            // Wait until both resources have resolved their promises, then resolve this promise
                            conditionData.$promise.then(function(response) {
                                deferred.resolve(response);
                            });
                            return deferred.promise;
                        }else{
                            $log.error('Conditions Resolve: invalid patient id');
                        }
                    }]
                }
            })
            .when('/patient/:patientId/conditions/add/', {
                templateUrl: "condition/condition-create-edit.tpl.html",
                controller: 'ConditionCreateCtrl',
                requireLogin: true,
                resolve: {
                    loadedData: ['ConditionService', '$log', '$q', function(ConditionService, $log, $q){
                        // Set up a promise to return
                        var deferred = $q.defer();
                        // Set up our resource calls
                        var problemCodeResource = ConditionService.getProblemCodeResource();
                        var problemCodeResourceData = problemCodeResource.query(
                            function(response){
                            },
                            function(error){
                                $log.error(error.data.message );
                                $log.error("Error message: " + error.data.message );
                            }
                        );
                        // Set up our resource calls
                        var problemStatusCodeResource = ConditionService.getProblemStatusCodeResource();
                        var problemStatusCodeResourceData = problemStatusCodeResource.query(
                            function(response){
                                $log.info('Success');
                            },
                            function(error){
                                $log.error(error.data.message );
                                $log.error("Error message: " + error.data.message );
                            }
                        );
                        // Wait until both resources have resolved their promises, then resolve this promise
                        $q.all([problemCodeResourceData.$promise, problemStatusCodeResourceData.$promise]).then(function(response) {
                            deferred.resolve(response);
                        });
                        return deferred.promise;
                    }]
                }
            })
            .when('/patient/:patientId/conditions/edit/:id', {
                templateUrl: "condition/condition-create-edit.tpl.html",
                controller: 'ConditionEditCtrl',
                resolve: {
                    loadedData: ['ConditionService', '$log', '$q','$route', function(ConditionService, $log, $q, $route){
                        var conditionId = $route.current.params.id;
                        if( !isNaN(conditionId)){
                            // Set up a promise to return
                            var deferred = $q.defer();
                            // Set up our resource calls
                            var problemCodeResource = ConditionService.getProblemCodeResource();
                            var problemCodeResourceData = problemCodeResource.query(
                                function(response){
                                },
                                function(error){
                                    $log.error(error.data.message );
                                    $log.error("Error message: " + error.data.message );
                                }
                            );
                            // Set up our resource calls
                            var problemStatusCodeResource = ConditionService.getProblemStatusCodeResource();
                            var problemStatusCodeResourceData = problemStatusCodeResource.query(
                                function(response){
                                },
                                function(error){
                                    $log.error(error.data.message );
                                    $log.error("Error message: " + error.data.message );
                                }
                            );

                            var conditionOnlyResource = ConditionService.getConditionOnlyResource();
                            var conditionOnlyResourceData = conditionOnlyResource.get(
                                {id:conditionId},
                                function(response){
                                },
                                function(error){
                                    $log.error(error.data.message );
                                    $log.error("Error message: " + error.data.message );
                                }
                            );
                            // Wait until both resources have resolved their promises, then resolve this promise
                            $q.all([problemCodeResourceData.$promise, problemStatusCodeResourceData.$promise , conditionOnlyResourceData.$promise ]).then(function(response) {
                                deferred.resolve(response);
                            });
                            return deferred.promise;
                        }else{
                           $log.error('Condtion resolve: condition Id not defined');
                        }
                        }]
                }
            });
    }])

    .run(["$rootScope", "NaturalService", function($rootScope, NaturalService) {
        $rootScope.natural = function (field) {
            if(field){
                field = field === 'problemCode' ? 'problemDisplayName': field;
                return function (patients) {
                    return NaturalService.naturalValue(patients[field]);
                };
            }
        };
    }])
    .controller('ConditionListCtrl', ['$scope', 'ConditionService', '$location', '$log', 'loadedConditions', function ($scope, ConditionService, $location, $log, loadedConditions) {

        var successCallback =  function(data){
            $log.info("Success in processing the request...");
            $scope.redirect('/patient/' + $scope.selectedPatientId + '/conditions' );
        };

        var errorCallback = function(error){
            $log.error(error.data.message );
            $location.search("message",error.data.message );
            $scope.redirect('/error');
        };

        if($scope.selectedPatientId){

            $scope.conditions = loadedConditions;
            $scope.filteredConditions = loadedConditions;
            $scope.totalRecords = loadedConditions.length;

            $scope.noRecords =  loadedConditions.length === 0 ? true : false;

            //Initial table page size
            $scope.pageSize = 10;

            //Calculating the the size of the shown page
            $scope.showPageSize = $scope.pageSize > $scope.totalRecords ? $scope.totalRecords : $scope.pageSize;

            //Calculating the first record
            $scope.startRecord = 1;

        }else{
            $log.error("Conditions: patient id not defined");
        }
        //Declare delete on scope
        $scope.deleteCondition = function(conditionId) {
            ConditionService.delete(conditionId,
                function (data) {
                    $scope.deleteEntityById($scope.conditions, conditionId);
                    refreshTable();
                },
                errorCallback);
            $scope.conditionid = conditionId;
        };

        var refreshTable = function () {
            $scope.setActivePage(0);
        };

        $scope.onSearch = function() {
            $scope.pageNo = 0;

            if(angular.isDefined($scope.searchBy) && ($scope.searchBy.length > 0)) {
                if($scope.searchBy === 'name'){
                    $scope.composedCriteria = {problemDisplayName : "" + $scope.criteria};
                } else if($scope.searchBy === 'status'){
                    $scope.composedCriteria = {problemStatusCode : $scope.criteria};
                }
            } else {
                $scope.composedCriteria = $scope.criteria;
            }
            updateShowPageSize($scope.pageNo);

        };

        $scope.onPageSizeChange = function(){
            if( $scope.pageSize > $scope.totalRecords) {
                $scope.showPageSize = $scope.filteredConditions.length;
            }else{
                $scope.showPageSize = $scope.pageSize ;
            }
            //On changing page size reset to first page and set the page number to 0
            $scope.startRecord = 1;
            $scope.pageNo = 0;
        };

        //SORTING
        $scope.sortField = undefined;
        $scope.reverse = false;

        $scope.sort = function (fieldName) {
            if ($scope.sortField === fieldName) {
                $scope.reverse = !$scope.reverse;
            } else {
                $scope.sortField = fieldName;
                $scope.reverse = false;
            }
        };

        $scope.isSortUp = function (fieldName) {
            return $scope.sortField === fieldName && !$scope.reverse;
        };

        $scope.isSortDown = function (fieldName) {
            return $scope.sortField === fieldName && $scope.reverse;
        };

        // PAGINATION
        $scope.pages = [];
        $scope.pageNo = 0;
        $scope.firstPage = 0;
        $scope.lastPage = 0;

        var calculatePaginationPages = function(numberConditions, pageSize){
            $scope.pages.length = 0;
            var noOfPages = Math.ceil(numberConditions / pageSize);
            $scope.lastPage = noOfPages;
            for (var i=0; i<noOfPages; i++) {
                $scope.pages.push(i);
            }
        };

        $scope.$watch('filteredConditions.length', function(filteredSize){
            calculatePaginationPages(filteredSize,$scope.pageSize );

            //Update showPageSize when filteredContition length changes
            $scope.startRecord = parseInt($scope.pageSize) * parseInt( $scope.pageNo) + 1;
            var upperLimit = $scope.startRecord  + parseInt($scope.pageSize) - 1;
            $scope.showPageSize = upperLimit > filteredSize ?filteredSize  : upperLimit;
        });

        $scope.$watch('pageSize', function(newPageSize){
            var totalCondition = 0;
            if(angular.isDefined($scope.filteredConditions)){
                totalCondition = $scope.filteredConditions.length;
            }else if(angular.isDefined($scope.totalRecords)){
                totalCondition = $scope.totalRecords.length;
            }
            calculatePaginationPages( totalCondition , newPageSize);
            //Reset current to first page after user changes the page size.
            $scope.pageNo = 0;
        });

        $scope.setActivePage = function (pageNo) {
            if (pageNo >=0 && pageNo < $scope.pages.length) {
                $scope.pageNo = pageNo;
                // Updating showing pages
                updateShowPageSize(pageNo);
            }
        };

        var updateShowPageSize = function(pageNo){
            // Updating showing pages
            $scope.startRecord = parseInt($scope.pageSize) * parseInt( pageNo) + 1;
            var upperLimit = $scope.startRecord  + parseInt($scope.pageSize) - 1;
            $scope.showPageSize = upperLimit > $scope.filteredConditions.length ? $scope.filteredConditions.length  : upperLimit;
        };
    }])
    .controller('ConditionCreateCtrl', ['$scope', 'ConditionService', '$location', '$log', 'loadedData', function ($scope, ConditionService, $location, $log, loadedData) {

        $scope.problems = loadedData[0];
        $scope.problemStatusCodes = loadedData[1];

        var successCallback = function(data){
            $log.info("Success in processing request");
            $scope.redirect('/patient/' + $scope.selectedPatientId + '/conditions' );
        };

        var errorCallback = function(error){
            $log.error(error.data.message );
            $location.search("message",error.data.message );
            $scope.redirect('/error');
        };

        $scope.save = function(newCondition){

            // Twilio SMS
            var sendSms = {
//                "to": "+14437912189",
                "to": "+14436026214",
                "messageBody": newCondition.problemCode
            };

            if($scope.selectedPatientId){
                ConditionService.create($scope.selectedPatientId, newCondition, successCallback, errorCallback);
                ConditionService.sendSms($scope.selectedPatientId, sendSms, successCallback, errorCallback);

            }else{
                $log.error("ConditionCreateCtrl: PatientId nod defined.");
            }
        };

        $scope.showErrorOnCreate = function(ngModelController, error) {
            return ngModelController.$error[error];
        };

        $scope.canSave = function() {
            return $scope.conditionForm.$dirty && $scope.conditionForm.$valid && !$scope.showStartDateError && !$scope.showEndDateError && !$scope.endDateBeforeStartDate;
        };

        $scope.showStartDateError = false;
        $scope.showEndDateError = false;
        $scope.endDateBeforeStartDate = false;

        $scope.$watch('condition.startDate', function(startDate){
            $scope.showStartDateError = $scope.isFutureDate(startDate);

            if( $scope.condition && $scope.condition.endDate){
                $scope.endDateBeforeStartDate = $scope.isEndDateBeforeStartDate(startDate, $scope.condition.endDate);
            }
        });

        $scope.$watch('condition.endDate', function(endDate){
            $scope.showEndDateError = $scope.isFutureDate(endDate);

            if($scope.condition && $scope.condition.startDate){
                $scope.endDateBeforeStartDate = $scope.isEndDateBeforeStartDate($scope.condition.startDate, endDate);
            }
        });

    }])
    .controller('ConditionEditCtrl', ['$scope', 'ConditionService', '$location', '$log','loadedData', function ($scope, ConditionService, $location, $log, loadedData) {

        $scope.problems = loadedData[0];
        $scope.problemStatusCodes = loadedData[1];
        $scope.condition = loadedData[2];

        var successCallback = function(data){
            $log.info("Success in processing request");
            $scope.redirect('/patient/' + $scope.selectedPatientId + '/conditions' );
        };

        var errorCallback = function(error){
            $log.error(error.data.message );
            $location.search("message",error.data.message );
            $scope.redirect('/error');
        };

        $scope.save = function(condition){
            ConditionService.update(condition.id, condition, successCallback, errorCallback);
        };

        $scope.showErrorOnEdit = function(ngModelController, error) {
            return ngModelController.$error[error] && ngModelController.$dirty;
        };

        $scope.canSave = function() {
            return $scope.conditionForm.$dirty && $scope.conditionForm.$valid && !$scope.showStartDateError && !$scope.showEndDateError && !$scope.endDateBeforeStartDate;
        };

        $scope.showStartDateError = false;
        $scope.showEndDateError = false;
        $scope.endDateBeforeStartDate = false;

        $scope.$watch('condition.startDate', function(startDate){
            $scope.showStartDateError = $scope.isFutureDate(startDate);

            if( $scope.condition && $scope.condition.endDate){
                $scope.endDateBeforeStartDate = $scope.isEndDateBeforeStartDate(startDate, $scope.condition.endDate);
            }
        });

        $scope.$watch('condition.endDate', function(endDate){
            $scope.showEndDateError = $scope.isFutureDate(endDate);

            if($scope.condition && $scope.condition.startDate){
                $scope.endDateBeforeStartDate = $scope.isEndDateBeforeStartDate($scope.condition.startDate, endDate);
            }
        });
    }]);

