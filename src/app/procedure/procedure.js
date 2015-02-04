'use strict';

angular.module('bham.procedureModule', [
        'ngResource',
        'bham.procedureService',
        'bham.procedureDirectives',
        'bham.filters',
        'bham.naturalSort'
    ])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/patient/:patientId/procedures', {
                templateUrl: "procedure/procedure-list.tpl.html",
                controller: 'ProcedureListCtrl',
                resolve: {
                    loadedProcedures: ['ProcedureService', '$log', '$q','$route', function(ProcedureService, $log, $q, $route){
                        var patient_Id = $route.current.params.patientId;
                        if( ! isNaN(patient_Id)){
                            // Set up a promise to return
                            var deferred = $q.defer();
                            // Set up our resource calls
                            var procedureResource = ProcedureService.getProcedureResource();
                            var procedureResourceData = procedureResource.query(
                                {patientId: patient_Id},
                                function(response){
                                },
                                function(error){
                                    $log.error(error.data.message );
                                    $log.error("Error message: " + error.data.message );
                                }
                            );
                            // Wait until both resources have resolved their promises, then resolve this promise
                            procedureResourceData.$promise.then(function(response) {
                                deferred.resolve(response);
                            });
                            return deferred.promise;
                        }else{
                            $log.error('SocialHistory Resolve: invalid patient id');
                        }
                    }]
                }
            })
            .when('/patient/:patientId/procedures/add', {
                templateUrl: "procedure/procedure-create-edit.tpl.html",
                controller: 'ProcedureCreateCtrl',
                resolve: {
                    loadedData: ['ProcedureService', '$log', '$q', function(ProcedureService, $log, $q){
                        // Set up a promise to return
                        var deferred = $q.defer();
                        // Set up our resource calls
                        var procedureCodeResource = ProcedureService.getProcedureCodeResource();
                        var procedureCodeResourceData = procedureCodeResource.query(
                            function(response){
                            },
                            function(error){
                                $log.error(error.data.message );
                                $log.error("Error message: " + error.data.message );
                            }
                        );
                        // Set up our resource calls
                        var procedureStatusCodeResource = ProcedureService.getProcedureStatusCodeResource();
                        var procedureStatusCodeResourceData = procedureStatusCodeResource.query(
                            function(response){
                            },
                            function(error){
                                $log.error(error.data.message );
                                $log.error("Error message: " + error.data.message );
                            }
                        );
                        // Wait until both resources have resolved their promises, then resolve this promise
                        $q.all([procedureCodeResourceData.$promise, procedureStatusCodeResourceData.$promise]).then(function(response) {
                            deferred.resolve(response);
                        });
                        return deferred.promise;
                    }]
                }
            })
            .when('/patient/:patientId/procedures/edit/:id', {
                templateUrl: "procedure/procedure-create-edit.tpl.html",
                controller: 'ProcedureEditCtrl',
                resolve: {
                    loadedData: ['ProcedureService', '$log', '$q','$route',  function(ProcedureService, $log, $q, $route){
                        var procedureId = $route.current.params.id;
                        if( !isNaN(procedureId)){
                            // Set up a promise to return
                            var deferred = $q.defer();
                            // Set up our resource calls
                            var procedureCodeResource = ProcedureService.getProcedureCodeResource();
                            var procedureCodeResourceData = procedureCodeResource.query(
                                function(response){
                                },
                                function(error){
                                    $log.error(error.data.message );
                                    $log.error("Error message: " + error.data.message );
                                }
                            );
                            // Set up our resource calls
                            var procedureStatusCodeResource = ProcedureService.getProcedureStatusCodeResource();
                            var procedureStatusCodeResourceData = procedureStatusCodeResource.query(
                                function(response){
                                },
                                function(error){
                                    $log.error(error.data.message );
                                    $log.error("Error message: " + error.data.message );
                                }
                            );

                            // Set up our resource calls
                            var procedureOnlyResource = ProcedureService.getProcedureOnlyResource();
                            var procedureOnlyResourceData = procedureOnlyResource.get(
                                {id: procedureId},
                                function(response){
                                },
                                function(error){
                                    $log.error(error.data.message );
                                    $log.error("Error message: " + error.data.message );
                                }
                            );


                            // Wait until both resources have resolved their promises, then resolve this promise
                            $q.all([procedureCodeResourceData.$promise, procedureStatusCodeResourceData.$promise, procedureOnlyResourceData.$promise]).then(function(response) {
                                deferred.resolve(response);
                            });
                            return deferred.promise;
                        }else{
                            $log.error("Procedure Resolve: procedure id not defined." );
                        }
                    }]
                }
            });
    }])

    .run(["$rootScope", "NaturalService", function($rootScope, NaturalService) {
        $rootScope.natural = function (field) {
            if(field){
                field = field === 'procedureTypeCode' ? 'procedureTypeName': field;
                return function (patients) {
                    return NaturalService.naturalValue(patients[field]);
                };
            }
        };
    }])

    .controller('ProcedureListCtrl', ['$scope', 'ProcedureService', '$location', '$log', 'loadedProcedures', function ($scope, ProcedureService, $location, $log, loadedProcedures) {
        var successCallback = function (data) {
            $log.info("Success in processing the request...");
//            $location.path('/patient/' + $scope.selectedPatientId + '/procedures' );
            $scope.redirect('/patient/' + $scope.selectedPatientId + '/procedures');
        };

        var errorCallback = function (error) {
            $log.error(error.data.message);
            $location.search("message", error.data.message);
            $scope.redirect('/procedures');
        };

        if($scope.selectedPatientId){
            $scope.procedures = loadedProcedures;
            $scope.filteredProcedures = loadedProcedures;
            $scope.totalRecords = loadedProcedures.length;

            $scope.noRecords =  loadedProcedures.length === 0 ? true : false;

            //Initial table page size
            $scope.pageSize = 10;
            //Calculating the the size of the shown page
            $scope.showPageSize = $scope.pageSize > $scope.totalRecords ? $scope.totalRecords : $scope.pageSize;

            //Calcating the first record
            $scope.startRecord = 1;
        }else{
            $log.error("Procedure: no patient has been selected.");
        }

        $scope.deleteProcedure = function (procedureId) {
            ProcedureService.delete(procedureId,
                function (data) {
                    $scope.deleteEntityById($scope.procedures, procedureId);
                    refreshTable();
                },
                errorCallback);
        };

        var refreshTable = function () {
            $scope.setActivePage(0);
        };

        $scope.onSearch = function () {
            //In case of search resetting the page number to the first page
            $scope.pageNo = 0;
            if (angular.isDefined($scope.searchBy) && ( $scope.searchBy.length > 0)) {
                if ($scope.searchBy === 'name') {
                    $scope.composedCriteria = {procedureTypeName: "" + $scope.criteria};
                } else if ($scope.searchBy === 'status') {
                    $scope.composedCriteria = {procedureStatusCode: $scope.criteria};
                }
            } else {
                $scope.composedCriteria = $scope.criteria;
            }
            updateShowPageSize($scope.pageNo);
        };

        //Initial table page size
        $scope.pageSize = 10;

        $scope.onPageSizeChange = function () {
            if ($scope.pageSize > $scope.totalRecords) {
                $scope.showPageSize = $scope.filteredProcedures.length;
            } else {
                $scope.showPageSize = $scope.pageSize;
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

        var calculatePaginationPages = function (numberProcedures, pageSize) {
            $scope.pages.length = 0;
            var noOfPages = Math.ceil(numberProcedures / pageSize);
            $scope.lastPage = noOfPages;
            for (var i = 0; i < noOfPages; i++) {
                $scope.pages.push(i);
            }
        };

        $scope.$watch('filteredProcedures.length', function (filteredSize) {
            calculatePaginationPages(filteredSize, $scope.pageSize);

            //Update showPageSize when filteredProcedure length changes
            $scope.startRecord = parseInt($scope.pageSize) * parseInt($scope.pageNo) + 1;
            var upperLimit = $scope.startRecord + parseInt($scope.pageSize) - 1;
            $scope.showPageSize = upperLimit > filteredSize ? filteredSize : upperLimit;

        });

        $scope.$watch('pageSize', function (newPageSize) {
            var totalProcedure = 0;
            if (angular.isDefined($scope.filteredProcedures)) {
                totalProcedure = $scope.filteredProcedures.length;
            } else if (angular.isDefined($scope.totalRecords)) {
                totalProcedure = $scope.totalRecords.length;
            }
            calculatePaginationPages(totalProcedure, newPageSize);
            //Reset current to first page after user changes the page size.
            $scope.pageNo = 0;
        });

        $scope.setActivePage = function (pageNo) {
            if (pageNo >= 0 && pageNo < $scope.pages.length) {
                $scope.pageNo = pageNo;
                // Updating showing pages
                updateShowPageSize(pageNo);
            }
        };

        var updateShowPageSize = function (pageNo) {
            // Updating showing pages
            $scope.startRecord = parseInt($scope.pageSize) * parseInt(pageNo) + 1;
            var upperLimit = $scope.startRecord + parseInt($scope.pageSize) - 1;
            $scope.showPageSize = upperLimit > $scope.filteredProcedures.length ? $scope.filteredProcedures.length : upperLimit;
        };

    }])
    .controller('ProcedureCreateCtrl', ['$scope', 'ProcedureService' , 'loadedData', '$location', '$log', function ($scope, ProcedureService , loadedData, $location, $log) {
        $scope.procedureCodes = loadedData[0];
        $scope.procedureStatusCodes = loadedData[1];

        var successCallback = function (data) {
            $log.info("Success in processing the request...");
            $scope.redirect('/patient/' + $scope.selectedPatientId + '/procedures');
        };

        var errorCallback = function (error) {
            $log.error(error.data.message);
            $location.search("message", error.data.message);
            $scope.redirect('/error');
        };

        $scope.save = function ( procedure) {
            ProcedureService.create($scope.selectedPatientId, procedure, successCallback, errorCallback);
        };

        $scope.canSave = function() {
            return $scope.procedureForm.$dirty && $scope.procedureForm.$valid && !$scope.showStartDateError && !$scope.showEndDateError && !$scope.endDateBeforeStartDate;
        };

        $scope.showStartDateError = false;
        $scope.showEndDateError = false;
        $scope.endDateBeforeStartDate = false;

        $scope.$watch('procedure.procedureStartDate', function(startDate){
            $scope.showStartDateError = $scope.isFutureDate(startDate);

            if( $scope.procedure && $scope.procedure.procedureEndDate){
                $scope.endDateBeforeStartDate = $scope.isEndDateBeforeStartDate(startDate, $scope.procedure.procedureEndDate);
            }
        });

        $scope.$watch('procedure.procedureEndDate', function(endDate){
            $scope.showEndDateError = $scope.isFutureDate(endDate);

            if($scope.procedure && $scope.procedure.procedureStartDate){
                $scope.endDateBeforeStartDate = $scope.isEndDateBeforeStartDate($scope.procedure.procedureStartDate, endDate);
            }
        });

    }])
    .controller('ProcedureEditCtrl', ['$scope', 'ProcedureService' , 'loadedData', '$location', '$log', function ($scope, ProcedureService , loadedData, $location, $log) {
        $scope.procedureCodes = loadedData[0];
        $scope.procedureStatusCodes = loadedData[1];
        $scope.procedure = loadedData[2];

        var successCallback = function (data) {
            //TODO Show success to user => notification
            $log.info("Success in processing the request...");
            $scope.redirect('/patient/' + $scope.selectedPatientId + '/procedures');
        };

        var errorCallback = function (error) {
            $log.error(error.data.message);
            $location.search("message", error.data.message);
            $scope.redirect('/error');
        };

        $scope.save = function ( procedure) {
            ProcedureService.update($scope.selectedPatientId, procedure, successCallback, errorCallback);
        };

        $scope.canSave = function() {
            return $scope.procedureForm.$dirty && $scope.procedureForm.$valid && !$scope.showStartDateError && !$scope.showEndDateError && !$scope.endDateBeforeStartDate;
        };

        $scope.showStartDateError = false;
        $scope.showEndDateError = false;
        $scope.endDateBeforeStartDate = false;

        $scope.$watch('procedure.procedureStartDate', function(startDate){
            $scope.showStartDateError = $scope.isFutureDate(startDate);

            if( $scope.procedure && $scope.procedure.procedureEndDate){
                $scope.endDateBeforeStartDate = $scope.isEndDateBeforeStartDate(startDate, $scope.procedure.procedureEndDate);
            }
        });

        $scope.$watch('procedure.procedureEndDate', function(endDate){
            $scope.showEndDateError = $scope.isFutureDate(endDate);

            if($scope.procedure && $scope.procedure.procedureStartDate){
                $scope.endDateBeforeStartDate = $scope.isEndDateBeforeStartDate($scope.procedure.procedureStartDate, endDate);
            }
        });

    }]);
