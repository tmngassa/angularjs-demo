'use strict';

angular.module('bham.socialhistoryModule',
        ['ngResource',
         'bham.socialhistoryService',
         'bham.socialhistoryDirectives',
         'bham.filters',
         'bham.naturalSort'
        ]
    )
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/patient/:patientId/socialhistories', {
                templateUrl: "socialhistory/socialhistory-list.tpl.html",
                controller: 'socialhistoryListCtrl',
                resolve: {
                    loadedSocialHistories: ['SocialhistoryService', '$log', '$q','$route', function(SocialhistoryService, $log, $q, $route){
                        var patientId = $route.current.params.patientId;
                        if( ! isNaN(patientId)){
                            // Set up a promise to return
                            var deferred = $q.defer();
                            // Set up our resource calls
                            var socialHistoryResource = SocialhistoryService.getSocialHistoryResource();
                            var socialHistoryData = socialHistoryResource.query(
                                    {patientId: patientId},
                                    function(response){
                                    },
                                    function(error){
                                        $log.error(error.data.message );
                                        $log.error("Error message: " + error.data.message );
                                    }
                            );
                            // Wait until both resources have resolved their promises, then resolve this promise
                            socialHistoryData.$promise.then(function(response) {
                                deferred.resolve(response);
                            });
                            return deferred.promise;
                        }else{
                            $log.error('SocialHistory Resolve: invalid patient id');
                        }
                    }]
                }
            })
            .when('/patient/:patientId/socialhistories/add', {
                templateUrl: "socialhistory/socialhistory-create-edit.tpl.html",
                controller: 'socialhistoryCreateCtrl',
                resolve: {
                    loadedData: ['SocialhistoryService', '$log', '$q', function(SocialhistoryService, $log, $q){
                        // Set up a promise to return
                        var deferred = $q.defer();
                        // Set up our resource calls
                        var socialHistoryTypeResource = SocialhistoryService.getSocialHistoryTypeResource();
                        var socialHistoryTypeData = socialHistoryTypeResource.query(
                                function(response){
                                },
                                function(error){
                                    $log.error(error.data.message );
                                    $log.error("Error message: " + error.data.message );
                                }
                        );
                        // Set up our resource calls
                        var problemStatusCodeResource = SocialhistoryService.getProblemStatusCodeResource();
                        var problemStatusCodeData = problemStatusCodeResource.query(
                                function(response){
                                },
                                function(error){
                                    $log.error(error.data.message );
                                    $log.error("Error message: " + error.data.message );
                                }
                        );
                        // Wait until both resources have resolved their promises, then resolve this promise
                        $q.all([socialHistoryTypeData.$promise, problemStatusCodeData.$promise]).then(function(response) {
                            deferred.resolve(response);
                        });
                        return deferred.promise;
                    }]
                }
            })
            .when('/patient/:patientId/socialhistories/edit/:id', {
                templateUrl: "socialhistory/socialhistory-create-edit.tpl.html",
                controller: 'socialhistoryEditCtrl',
                resolve: {
                    loadedData: ['SocialhistoryService', '$log', '$q', '$route', function(SocialhistoryService, $log, $q, $route){
                        var socialHistoryId = $route.current.params.id;
                        if( !isNaN(socialHistoryId)){
                            // Set up a promise to return
                            var deferred = $q.defer();
                            // Set up our resource calls
                            var socialHistoryTypeResource = SocialhistoryService.getSocialHistoryTypeResource();
                            var socialHistoryTypeData = socialHistoryTypeResource.query(
                                    function(response){
                                    },
                                    function(error){
                                        $log.error(error.data.message );
                                        $log.error("Error message: " + error.data.message );
                                    }
                            );
                            // Set up our resource calls
                            var problemStatusCodeResource = SocialhistoryService.getProblemStatusCodeResource();
                            var problemStatusCodeData = problemStatusCodeResource.query(
                                    function(response){
                                    },
                                    function(error){
                                        $log.error(error.data.message );
                                        $log.error("Error message: " + error.data.message );
                                    }
                            );
                            // Set up our resource calls
                            var socialHistoryOnlyResource = SocialhistoryService.getSocialHistoryOnlyResource();
                            var socialHistoryOnlyData = socialHistoryOnlyResource.get(
                                    {id:socialHistoryId},
                                    function(response){
                                    },
                                    function(error){
                                        $log.error(error.data.message );
                                        $log.error("Error message: " + error.data.message );
                                    }
                            );

                            // Wait until both resources have resolved their promises, then resolve this promise
                            $q.all([socialHistoryTypeData.$promise, problemStatusCodeData.$promise, socialHistoryOnlyData.$promise]).then(function(response) {
                                deferred.resolve(response);
                            });
                            return deferred.promise;
                        }else{
                            $log.error('SocialHistory Resolve: invalid socialhistory id');
                        }

                    }]
                }
            });
    }])

    .run(["$rootScope", "NaturalService", function($rootScope, NaturalService) {
        $rootScope.natural = function (field) {
            if(field){
                field = field === 'socialHistoryTypeCode' ? 'socialHistoryTypeName': field;
                return function (patients) {
                    return NaturalService.naturalValue(patients[field]);
                };
            }
        };
    }])

    .controller('socialhistoryListCtrl', ['$scope', 'SocialhistoryService', '$location', '$log','loadedSocialHistories', function ($scope, SocialhistoryService, $location, $log, loadedSocialHistories) {
        var successCallback =  function(data){
            $log.info("Success in processing the request...");
            $scope.redirect('/patient/' + $scope.selectedPatientId + '/socialhistories' );
        };

        var errorCallback = function(error){
            $log.error(error.data.message );
            $location.search("message",error.data.message );
            $scope.redirect('/error');
        };

        if($scope.selectedPatientId){
            //Getting list of socialhistories
            $scope.socialhistories = loadedSocialHistories;
            $scope.filteredsocialhistories = loadedSocialHistories;
            $scope.totalRecords = loadedSocialHistories.length;

            $scope.noRecords =  loadedSocialHistories.length === 0 ? true : false;

            //Initial table page size
            $scope.pageSize = 10;

            //Calculating the the size of the shown page
            $scope.showPageSize = $scope.pageSize > $scope.totalRecords ? $scope.totalRecords : $scope.pageSize;

            //Calcating the first record
            $scope.startRecord = 1;
        }else{
            $log.error("SocialHistories: No patient has been selected.");
        }

        $scope.deleteSocialhistory = function(socialhistoryId){
            SocialhistoryService.delete(socialhistoryId,
                function (data) {
                    $scope.deleteEntityById($scope.socialhistories, socialhistoryId);
                    refreshTable();
                },
                errorCallback);
            $scope.socialhistoryid = socialhistoryId;
        };

        var refreshTable = function () {
            $scope.setActivePage(0);
        };

        $scope.onSearch = function(){
            //In case of search resetting the page number to the first page
            $scope.pageNo = 0;

            if(angular.isDefined($scope.searchBy) && ( $scope.searchBy.length > 0) ){
                if($scope.searchBy === 'name'){
                    $scope.composedCriteria = {socialHistoryTypeName : "" + $scope.criteria};
                }else if($scope.searchBy === 'status'){
                    $scope.composedCriteria = {socialHistoryStatusCode : $scope.criteria};
                }
            }else{
                $scope.composedCriteria = $scope.criteria;
            }
            updateShowPageSize($scope.pageNo);
        };

        //Initial table page size
        $scope.pageSize = 10;

        $scope.onPageSizeChange = function(){
            if( $scope.pageSize > $scope.totalRecords) {
                $scope.showPageSize = $scope.filteredsocialhistories.length;
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

        var calculatePaginationPages = function(numbersocialhistories, pageSize){
            $scope.pages.length = 0;
            var noOfPages = Math.ceil(numbersocialhistories / pageSize);
            $scope.lastPage = noOfPages;
            for (var i=0; i<noOfPages; i++) {
                $scope.pages.push(i);
            }
        };

        $scope.$watch('filteredsocialhistories.length', function(filteredSize){
            calculatePaginationPages(filteredSize,$scope.pageSize );

            //Update showPageSize when filteredSocial history length changes
            $scope.startRecord = parseInt($scope.pageSize) * parseInt( $scope.pageNo) + 1;
            var upperLimit = $scope.startRecord  + parseInt($scope.pageSize) - 1;
            $scope.showPageSize = upperLimit > filteredSize ? filteredSize  : upperLimit;
        });

        $scope.$watch('pageSize', function(newPageSize){
            var totalsocialhistory = 0;
            if(angular.isDefined($scope.filteredsocialhistories)){
                totalsocialhistory = $scope.filteredsocialhistories.length;
            }else if(angular.isDefined($scope.totalRecords)){
                totalsocialhistory = $scope.totalRecords.length;
            }
            calculatePaginationPages( totalsocialhistory , newPageSize);
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
            $scope.showPageSize = upperLimit > $scope.filteredsocialhistories.length ? $scope.filteredsocialhistories.length  : upperLimit;
        };
    }])
    .controller('socialhistoryCreateCtrl', ['$scope', 'SocialhistoryService', '$location', '$log', 'loadedData', function ($scope, SocialhistoryService, $location, $log, loadedData) {

        $scope.socialhistoryTypeCodes = loadedData[0];
        $scope.problemStatusCodes = loadedData[1];


        var successCallback = function(data){
            $log.info("Success in processing request");
            $scope.redirect('/patient/' + $scope.selectedPatientId + '/socialhistories' );
        };

        var errorCallback = function(error)
        {
            $log.error(error.data.message );
            $location.search("message",error.data.message );
            $scope.redirect('/error');
        };

        $scope.save = function(newSocialhistory){
            SocialhistoryService.create( $scope.selectedPatientId, newSocialhistory, successCallback, errorCallback);
        };

        $scope.showErrorOnCreate = function(ngModelController, error) {
            return ngModelController.$error[error];
        };

        $scope.canSave = function() {
            return $scope.socialhistoryForm.$dirty && $scope.socialhistoryForm.$valid && !$scope.showStartDateError && !$scope.showEndDateError && !$scope.endDateBeforeStartDate;
        };

        $scope.showStartDateError = false;
        $scope.showEndDateError = false;
        $scope.endDateBeforeStartDate = false;

        $scope.$watch('socialhistory.startDate', function(startDate){
            $scope.showStartDateError = $scope.isFutureDate(startDate);

            if( $scope.socialhistory && $scope.socialhistory.endDate){
                $scope.endDateBeforeStartDate = $scope.isEndDateBeforeStartDate(startDate, $scope.socialhistory.endDate);
            }
        });

        $scope.$watch('socialhistory.endDate', function(endDate){
            $scope.showEndDateError = $scope.isFutureDate(endDate);

            if($scope.socialhistory && $scope.socialhistory.startDate){
                $scope.endDateBeforeStartDate = $scope.isEndDateBeforeStartDate($scope.socialhistory.startDate, endDate);
            }
        });
    }])
    .controller('socialhistoryEditCtrl', ['$scope', 'SocialhistoryService', '$routeParams', '$location', '$log', 'loadedData', function ($scope, SocialhistoryService, $routeParams, $location, $log, loadedData) {

        $scope.socialhistoryTypeCodes = loadedData[0];
        $scope.problemStatusCodes = loadedData[1];
        $scope.socialhistory = loadedData[2];

        var successCallback = function(data){
            $log.info("Success in processing request");
            $scope.redirect('/patient/' + $scope.selectedPatientId + '/socialhistories' );

        };

        var errorCallback = function(error){
            $log.error(error.data.message );
            $location.search("message",error.data.message );
            $scope.redirect('/error');
        };

        $scope.save = function(socialhistory){
            SocialhistoryService.update(socialhistory.id, socialhistory, successCallback, errorCallback);
        };

        $scope.showErrorOnEdit = function(ngModelController, error) {
            return ngModelController.$error[error] && ngModelController.$dirty;
        };

        $scope.canSave = function() {
            return $scope.socialhistoryForm.$dirty && $scope.socialhistoryForm.$valid && !$scope.showStartDateError && !$scope.showEndDateError && !$scope.endDateBeforeStartDate;
        };

        $scope.showStartDateError = false;
        $scope.showEndDateError = false;
        $scope.endDateBeforeStartDate = false;

        $scope.$watch('socialhistory.startDate', function(startDate){
            $scope.showStartDateError = $scope.isFutureDate(startDate);

            if( $scope.socialhistory && $scope.socialhistory.endDate){
                $scope.endDateBeforeStartDate = $scope.isEndDateBeforeStartDate(startDate, $scope.socialhistory.endDate);
            }
        });

        $scope.$watch('socialhistory.endDate', function(endDate){
            $scope.showEndDateError = $scope.isFutureDate(endDate);

            if($scope.socialhistory && $scope.socialhistory.startDate){
                $scope.endDateBeforeStartDate = $scope.isEndDateBeforeStartDate($scope.socialhistory.startDate, endDate);
            }
        });

    }]);

