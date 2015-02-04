angular.module("bham.caremanagerModule", [
        'ngResource',
        'bham.caremanagerService'
    ])

    .config(['$routeProvider', function($routeProvider) {
        'use strict';

        $routeProvider
            .when('/caremanager', {
                templateUrl: "caremanager/caremanager-profile.tpl.html",
                controller: "CaremanagerCtrl",
                resolve: {
                    loadedData: ['CareManagerService', '$log', '$q', function(CareManagerService, $log, $q){
                        var careManagerId = 1;
                        if( !isNaN(careManagerId)){
                            // Set up a promise to return
                            var deferred = $q.defer();
                            // Set up our resource calls

                            var careManagerResource = CareManagerService.getCareManagerResource();
                            var careManagerData = careManagerResource.get(
                                {id:careManagerId},
                                function(response){
                                },
                                function(error){
                                    $log.error(error.data.message );
                                    $log.error("Error message: " + error.data.message );
                                }
                            );

                            // Set up our resource calls
                            var stateResource = CareManagerService.getStateResource();
                            var stateResourceData = stateResource.query(
                                function(response){
                                },
                                function(error){
                                    $log.error(error.data.message );
                                    $log.error("Error message: " + error.data.message );
                                }
                            );

                            // Set up our resource calls
                            var providerTaxonomyResource = CareManagerService.getProviderTaxonomyResource();
                            var providerTaxonomyData = providerTaxonomyResource.query(
                                function(response){
                                },
                                function(error){
                                    $log.error(error.data.message );
                                    $log.error("Error message: " + error.data.message );
                                }
                            );

                            // Wait until both resources have resolved their promises, then resolve this promise
                            $q.all([stateResourceData.$promise, providerTaxonomyData.$promise, careManagerData.$promise]).then(function(response) {
                                deferred.resolve(response);
                            });
                            return deferred.promise;

                        } else {
                            $log.error("CareManager Get Resolve: Care manager id not defined.");
                        }
                    }]
                }
            });
    }])
    .controller("CaremanagerCtrl",['$scope','$log', '$location', 'loadedData', 'CareManagerService',  function($scope, $log, $location, loadedData, CareManagerService){

        'use strict';

        // Switch Tabs
        $scope.activeTab  = 'basic';
        $scope.switchTabTo = function (tabId) {
            $scope.activeTab = tabId;
        };

        // Bound care manager data to scope
        $scope.states = loadedData[0];
        $scope.specialities = loadedData[1];
        $scope.caremanager = loadedData[2];


        //Update CareManager
        var successCallback =  function(data){
            //TODO Show success to user => notification
            $log.info("Success in processing the request...");
            $scope.redirect('/caremanager');
        };
        var errorCallback = function(error){
            $log.error(error.data.message );
            $location.search("message",error.data.message );
            $scope.redirect('/error');
        };
        $scope.save = function(caremanager){
            CareManagerService.update(caremanager.id , caremanager,successCallback,errorCallback);
        };

        //Validation
        $scope.showErrorOnCreate = function(ngModelController, error) {
            return ngModelController.$error[error];
        };

    }])
    ;
