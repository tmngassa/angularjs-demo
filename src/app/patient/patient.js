'use strict';

angular.module('bham.patientModule', [
        'ngResource',
        'bham.patientService',
        'bham.patientDirectives',
        'bham.conditionService',
        'bham.socialhistoryService',
        'bham.procedureService',
        'bham.filters',
        'bham.naturalSort'
    ])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/patients', {
                templateUrl: "patient/patient-list.tpl.html",
                controller: 'PatientListCtrl',
                resolve: {
                    loadedPatients: ['PatientService', '$log', '$q','$route', function(PatientService, $log, $q, $route){
                        // Set up a promise to return
                        var deferred = $q.defer();
                        // Set up our resource calls
                        var patientResource = PatientService.getPatientResource();
                        var patientData = patientResource.query(
                            function(response){
                            },
                            function(error){
                                $log.error(error.data.message );
                                $log.error("Error message: " + error.data.message );
                            }
                        );
                        patientData.$promise.then(function(response) {
                            deferred.resolve(response);
                        });
                        return deferred.promise;
                    }]
                }
            })
            .when('/patients/add', {
                templateUrl: "patient/patient-create-edit.tpl.html",
                controller: 'PatientCreateCtrl',
                resolve: {
                    loadedData: ['PatientService', '$log', '$q', function(PatientService, $log, $q){
                        // Set up a promise to return
                        var deferred = $q.defer();
                        // Set up our resource calls
                        var stateResource = PatientService.getStateResource();
                        var stateResourceData = stateResource.query(
                            function(response){
                            },
                            function(error){
                                $log.error(error.data.message );
                                $log.error("Error message: " + error.data.message );
                            }
                        );
                        // Set up our resource calls
                        var raceResource = PatientService.getRaceResource();
                        var raceResourceData = raceResource.query(
                            function(response){
                                $log.info('Success');
                            },
                            function(error){
                                $log.error(error.data.message );
                                $log.error("Error message: " + error.data.message );
                            }
                        );
                        // Wait until both resources have resolved their promises, then resolve this promise
                        $q.all([stateResourceData.$promise, raceResourceData.$promise]).then(function(response) {
                            deferred.resolve(response);
                        });
                        return deferred.promise;
                    }]
                }
            })
            .when('/patients/edit/:id', {
                templateUrl: "patient/patient-create-edit.tpl.html",
                controller: 'PatientEditCtrl',
                resolve: {
                        loadedData: ['PatientService', '$log', '$q', '$route', function(PatientService, $log, $q, $route){
                            var patientId = $route.current.params.id;
                            if( !isNaN(patientId)){
                                    // Set up a promise to return
                                    var deferred = $q.defer();
                                    // Set up our resource calls
                                    var stateResource = PatientService.getStateResource();
                                    var stateResourceData = stateResource.query(
                                        function(response){
                                        },
                                        function(error){
                                            $log.error(error.data.message );
                                            $log.error("Error message: " + error.data.message );
                                        }
                                    );
                                    // Set up our resource calls
                                    var raceResource = PatientService.getRaceResource();
                                    var raceResourceData = raceResource.query(
                                        function(response){
                                            $log.info('Success');
                                        },
                                        function(error){
                                            $log.error(error.data.message );
                                            $log.error("Error message: " + error.data.message );
                                        }
                                    );

                                    var patientResource = PatientService.getPatientResource();
                                    var patientResourceData = patientResource.get(
                                        {id:patientId},
                                        function(response){
                                        },
                                        function(error){
                                            $log.error(error.data.message );
                                            $log.error("Error message: " + error.data.message );
                                        }
                                    );
                                    // Wait until both resources have resolved their promises, then resolve this promise
                                    $q.all([stateResourceData.$promise, raceResourceData.$promise, patientResourceData.$promise]).then(function(response) {
                                        deferred.resolve(response);
                                    });
                                    return deferred.promise;
                            }else{
                                $log.error("Patient Edit Resolve: patient id not defined.");
                            }
                        }]
                }
            })
            .when('/patient/:id/treatmentplan', {
                templateUrl: "patient/patient-treatment-planning.tpl.html",
                controller: 'PatientTreatmentCtrl',
                resolve: {
                    loadedData: ['ConditionService', 'SocialhistoryService', 'ProcedureService', '$log', '$q', '$route',
                        function (ConditionService, SocialhistoryService, ProcedureService,  $log, $q, $route) {

                            var patientId = $route.current.params.id;

                            if (!isNaN(patientId)) {

                                var deffered = $q.defer();
                                var conditionResource = ConditionService.getConditionResource();
                                var conditionData = conditionResource.query(
                                    {patientId: patientId},
                                    function (data) {

                                    },
                                    function (error) {
                                        $log.error(error.data.message );
                                        $log.error("Error message: " + error.data.message );
                                    }
                                );

                                var socialhistoryResource = SocialhistoryService.getSocialHistoryResource();
                                var socialhistoryData = socialhistoryResource.query(
                                    {patientId: patientId},
                                    function(data) {

                                    },
                                    function(error) {
                                        $log.error(error.data.message );
                                        $log.error("Error message: " + error.data.message );
                                    }
                                );

                                var procedureResource = ProcedureService.getProcedureResource();
                                var procedureData = procedureResource.query(
                                    {patientId: patientId},
                                    function(data) {

                                    },
                                    function(error) {
                                        $log.error(error.data.message );
                                        $log.error("Error message: " + error.data.message );
                                    }
                                );

                                $q.all([conditionData.$promise, socialhistoryData.$promise, procedureData.$promise]).then(function(response) {
                                    deffered.resolve(response);
                                });

                                return deffered.promise;
                            } else {
                                $log.error('Conditions Resolve : invalid patient id');
                            }
                        }]
                }
            }).
            when('/patient/:id/patientprofile', {
                templateUrl: "patient/patient-profile.tpl.html",
                controller: 'PatientProfileCtrl',
                resolve: {
                    loadedData: ['ConditionService', 'SocialhistoryService', 'ProcedureService', '$log', '$q', '$route',
                        function (ConditionService, SocialhistoryService, ProcedureService,  $log, $q, $route) {

                            var patientId = $route.current.params.id;

                            if (!isNaN(patientId)) {

                                var deffered = $q.defer();
                                var conditionResource = ConditionService.getConditionResource();
                                var conditionData = conditionResource.query(
                                    {patientId: patientId},
                                    function (data) {

                                    },
                                    function (error) {
                                        $log.error(error.data.message );
                                        $log.error("Error message: " + error.data.message );
                                    }
                                );

                                var socialhistoryResource = SocialhistoryService.getSocialHistoryResource();
                                var socialhistoryData = socialhistoryResource.query(
                                    {patientId: patientId},
                                    function(data) {

                                    },
                                    function(error) {
                                        $log.error(error.data.message );
                                        $log.error("Error message: " + error.data.message );
                                    }
                                );

                                var procedureResource = ProcedureService.getProcedureResource();
                                var procedureData = procedureResource.query(
                                    {patientId: patientId},
                                    function(data) {

                                    },
                                    function(error) {
                                        $log.error(error.data.message );
                                        $log.error("Error message: " + error.data.message );
                                    }
                                );

                                $q.all([conditionData.$promise, socialhistoryData.$promise, procedureData.$promise]).then(function(response) {
                                    deffered.resolve(response);
                                });

                                return deffered.promise;
                            } else {
                                $log.error('Conditions Resolve : invalid patient id');
                            }
                        }]
                }
            })
            .when('/patient/:id/demographics', {
                templateUrl: "patient/patient-list.tpl.html",
                controller: 'PatientListCtrl',
                resolve: {
                    loadedPatients: ['PatientService', '$log', '$q','$route', '$location', function(PatientService, $log, $q, $route, $location){
                        var patientId = $route.current.params.id;
                        var queryParams = {};
                        if( !isNaN(patientId) ){
                            queryParams = {id: patientId};
                            // Set up a promise to return
                            var deferred = $q.defer();
                            // Set up our resource calls
                            var patientResource = PatientService.getPatientResource();
                            var patientData = patientResource.get(
                                queryParams,
                                function(response){
                                },
                                function(error){
                                    $log.error(error.data.message );
                                    $log.error("Error message: " + error.data.message );
                                }
                            );
                            patientData.$promise.then(function(response) {
                                deferred.resolve(response);
                            });
                            return deferred.promise;
                        }

                    }]
                }
            });
    }])
    .run(["$rootScope", "NaturalService", function($rootScope, NaturalService) {
        $rootScope.natural = function (field) {
            if(field){
                field = field === 'raceCode' ? 'raceCodeDisplayName': field;
                return function (patients) {
                      return NaturalService.naturalValue(patients[field]);
                };
            }
        };
    }])

    .controller('PatientListCtrl', ['$scope', 'PatientService', '$location', '$log', 'loadedPatients',  function ($scope, PatientService, $location, $log, loadedPatients) {

        var successCallback =  function(data){
            $log.info("Success in processing the request...");
            $scope.redirect('/patients');
        };

        var errorCallback = function(error){
            $log.error(error.data.message );
            $location.search("message",error.data.message );
            $scope.redirect('/error');
        };

        var patientList = [];

        if(!angular.isArray(loadedPatients)){
            patientList.push(loadedPatients);
            $scope.toggleDemographicMode(true);
        }else{
            $scope.toggleDemographicMode(false);
            patientList = loadedPatients;
        }

//      Initial table page size
        $scope.pageSize = 10;

        $scope.patients = patientList;
        $scope.filteredPatients = patientList;
        $scope.totalRecords = patientList.length;

        //Calculating the the size of the shown page
        $scope.showPageSize = $scope.pageSize > $scope.totalRecords ? $scope.totalRecords : $scope.pageSize;

        //Calcating the first record
        $scope.startRecord = 1;

        $scope.deletePatient = function(patientId){
            PatientService.delete(patientId,
                function(data){
                    $log.info("Success in deleting patient with id: " + patientId);
                    $scope.deleteEntityById($scope.patients, patientId);
                    refreshTable();
                },
                errorCallback);
        };

        //Refreshing table by making the first page the current page
        var refreshTable = function(){
            $scope.setActivePage(0);
        };

        $scope.onSearch = function(){
            //In case of search resetting the page number to the first page
            $scope.pageNo = 0;

            if(angular.isDefined($scope.searchBy) && ( $scope.searchBy.length > 0) ){
                if($scope.searchBy === 'administrativeGenderCodeDisplayName'){
                    $scope.composedCriteria = {administrativeGenderCodeDisplayName : "" + $scope.criteria};
                }else if($scope.searchBy === 'addressPostalCode'){
                    $scope.composedCriteria = {addressPostalCode : $scope.criteria};
                }
            }else{
                $scope.composedCriteria = $scope.criteria;
            }
        };


        $scope.onPageSizeChange = function(){
            if( $scope.pageSize > $scope.totalRecords) {
                $scope.showPageSize = $scope.filteredPatients.length;
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

        var calculatePaginationPages = function(numberPatients, pageSize){
            $scope.pages.length = 0;
            var noOfPages = Math.ceil(numberPatients / pageSize);
            $scope.lastPage = noOfPages;
            for (var i=0; i<noOfPages; i++) {
                $scope.pages.push(i);
            }

        };

        $scope.$watch('filteredPatients.length', function(filteredSize){
            calculatePaginationPages(filteredSize,$scope.pageSize );

            //Update showPageSize when filteredPatient length changes
            $scope.startRecord = parseInt($scope.pageSize) * parseInt( $scope.pageNo) + 1;
            var upperLimit = $scope.startRecord  + parseInt($scope.pageSize) - 1;
            $scope.showPageSize = upperLimit > filteredSize? filteredSize  : upperLimit;

        });

        $scope.$watch('pageSize', function(newPageSize){
            var totalPatient = 0;
            if(angular.isDefined($scope.filteredPatients)){
                totalPatient = $scope.filteredPatients.length;
            }else if(angular.isDefined($scope.totalRecords)){
                totalPatient = $scope.totalRecords.length;
            }
            calculatePaginationPages( totalPatient , newPageSize);
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
            var filteredpatientslenght = $scope.filteredPatients.length;
            $scope.showPageSize = upperLimit > filteredpatientslenght ? filteredpatientslenght  : upperLimit;
        };
    }])
    .controller('PatientCreateCtrl', ['PatientService', '$scope', '$log', '$location','loadedData',  function(PatientService, $scope, $log, $location, loadedData){

        $scope.states = loadedData[0];
        $scope.races = loadedData[1];

        //CRUD OPERATION
        var successCallback =  function(data){
            //TODO Show success to user => notification
            $log.info("Success in processing the request...");
            $scope.redirect('/patients');
        };

        var errorCallback = function(error){
            $log.error(error.data.message );
            $location.search("message",error.data.message );
            $scope.redirect('/error');
        };

        $scope.save = function(patient){
            PatientService.create(patient,successCallback,errorCallback);
        };

        // Create patient
        $scope.showErrorOnCreate = function(ngModelController, error) {
            return ngModelController.$error[error];
        };

        $scope.canSave = function() {
            return $scope.patientForm.$dirty && $scope.patientForm.$valid && !$scope.showCompareDateError ;
        };

        $scope.showCompareDateError = false;

        $scope.$watch('patient.birthDate', function(birthdate){
            $scope.showCompareDateError = $scope.isFutureDate(birthdate);
        });
    }])

    .controller('PatientEditCtrl', ['PatientService', '$scope', '$log', '$location','loadedData',  function(PatientService, $scope, $log, $location, loadedData){

        $scope.states = loadedData[0];
        $scope.races = loadedData[1];
        $scope.patient = loadedData[2];

        //CRUD OPERATION
        var successCallback =  function(data){
            //TODO Show success to user => notification
            $log.info("Success in processing the request...");

            //Route to patient demographics id enable otherwise patient list
            if($scope.isDemographics){
                $scope.redirect('/patient/' + $scope.selectedPatientId + '/demographics');
            }else{
                $scope.redirect('/patients');
            }
        };

        var errorCallback = function(error){
            $log.error(error.data.message );
            $location.search("message",error.data.message );
            $scope.redirect('/error');
        };

        $scope.save = function(patient){
            PatientService.update(patient.id , patient,successCallback,errorCallback);
        };

        // Create patient
        $scope.showErrorOnCreate = function(ngModelController, error) {
            return ngModelController.$error[error];
        };

        $scope.canSave = function() {
            return $scope.patientForm.$dirty && $scope.patientForm.$valid && !$scope.showCompareDateError ;
        };

        $scope.showCompareDateError = false;

        $scope.$watch('patient.birthDate', function(birthdate){
            $scope.showCompareDateError = $scope.isFutureDate(birthdate);
        });
    }])
    .controller('PatientTreatmentCtrl', ['$scope', 'PatientService', '$location', '$log', 'loadedData', '$routeParams', '$window', function ($scope, PatientService, $location, $log, loadedData, $routeParams, $window) {

        $scope.longTermGoal = false;
        $scope.shortTermGoal = false;

        var errorCallback = function(error){
            $log.error(error.data.message );
            $location.search("message",error.data.message );
            $scope.redirect('/error');
        };

        if(angular.isDefined($routeParams.id)){

            PatientService.get($routeParams.id,
                function(patient){
                    $scope.patient = patient;
                    $scope.populateCustomPatientMenu(patient);
                    $scope.selectTreatmentPlanMenu();

                    if($scope.selectedPatientId) {
                        $scope.conditions = loadedData[0];
                        $scope.socialhistories = loadedData[1];
                        $scope.procedures = loadedData[2];

                        $scope.noCondition = loadedData[0].length === 0? true: false;
                        $scope.noSocialHistory = loadedData[1].length === 0? true: false;
                        $scope.noProcedure = loadedData[2].length === 0? true: false;
                    }
                },
                errorCallback
            );
        }else{
            $log.error("PatientTreatmentCtrl: patient id not defined");
        }

        $scope.steps = ['one', 'two', 'three', 'four'];
        $scope.step = 0;

        $scope.one = 'active';
        $scope.two = '';
        $scope.three = '';
        $scope.four = '';


        $scope.isFirstStep = function() {
            return $scope.step === 0;
        };

        $scope.isLastStep = function() {
            return $scope.step === ($scope.steps.length - 1);
        };

        $scope.isCurrentStep = function(step) {
            return $scope.step === step;
        };

        $scope.setCurrentStep = function(step) {
            $scope.step = step;
        };

        $scope.getCurrentStep = function() {
            $scope.currentStep =  $scope.steps[$scope.step];
            if( $scope.currentStep === 'one') {
                $scope.four = '';
                $scope.three = '';
                $scope.two = '';
                $scope.one = 'active';
            }else if( $scope.currentStep === 'two') {
                $scope.four = '';
                $scope.three = '';
                $scope.two = 'active';
                $scope.one = 'complete';
            }else if( $scope.currentStep === 'three') {
                $scope.four = '';
                $scope.three = 'active';
                $scope.two = 'complete';
                $scope.one = 'complete';
            }else if( $scope.currentStep === 'four') {
                $scope.four = 'active';
                $scope.three = 'complete';
                $scope.two = 'complete';
                $scope.one = 'complete';
            }
            return $scope.steps[$scope.step];
        };

        $scope.getNextLabel = function() {
            return ($scope.isLastStep()) ? 'Submit' : 'Next';
        };

        $scope.handlePrevious = function() {
            $scope.step -= ($scope.isFirstStep()) ? 0 : 1;
        };

        $scope.handleNext = function() {
            if($scope.isLastStep()) {
                $scope.onSelectmenu('patientList');
                $scope.redirect('/patients');
            } else {

                if($scope.step === 0){
                    getWekaData();
                }
                $scope.step += 1;
            }
        };

        var getWekaData = function(){
            var condition = $scope.conditions[0];
            var socialHistory = $scope.socialhistories[0];

//            var wekaObject = {
//                problemCode:condition.problemCode,
//                problemCodeSystem:'2.16.840.1.113883.6.3',
//                age:'5',
//                race:$scope.selectedPatient.raceCode,
//                genderCode:$scope.selectedPatient.administrativeGenderCodeDisplayName,
//                zipCode: $scope.selectedPatient.addressPostalCode,
//                socialHistoryCode: socialHistory.socialHistoryCode
//            };

            var wekaObject = {
                problemCode:'I10',
                problemCodeSystem:'2.16.840.1.113883.6.3',
                age:'2',
                race:'1002-5',
                genderCode:'Male',
                zipCode: '21075',
                socialHistoryCode: 'F11.20'
            };

            PatientService.queryWeka(
                wekaObject,
                function(wekaResponse){
                    var recommendations = wekaResponse.recommendations[0];

                    if(recommendations){
                        $scope.goals = recommendations.patientGoal ;
                        $scope.objectives = recommendations.objectives ;
                        $scope.interventions = recommendations.probabilityDistributionList;
                    }else{
                        $log.error("Empty recoommendation object from Weka.");
                    }

                },
                function(wekaError){
                    $log.error(wekaError);
                }
            );

        };

        $scope.openInfoButtonPage = function(){
            $window.open("http://www.nlm.nih.gov/medlineplus/drugabuse.html");
        };

        $scope.openEvidencePage = function(){
            $window.open("assets/documents/practice_guidelines_treatment_patient_substance_use_disorder_2_edition_apa.pdf");
        };

    }])
    .controller('PatientProfileCtrl', ['$scope','$log', 'loadedData', 'PatientService',  function($scope, $log, loadedData, PatientService){
        var errorCallback = function(error){
            //TODO Show error to user
            $log.error("Error: " + error.data.message);
        };

        if($scope.selectedPatientId){

            $scope.collapseDemographics = "";
            $scope.toggleDemographicsClass = false;

            $scope.collapseConditions = "";
            $scope.toggleConditionsClass = false;

            $scope.collapseSocialhistory = "";
            $scope.toggleSocialhistoryClass = false;

            $scope.collapseProcedure = "";
            $scope.toggleProcedureClass = false;

            $scope.onDemographicsClick = function(){
                $scope.collapseDemographics = $scope.collapseDemographics === "collapse" ? '' : 'collapse';
                $scope.toggleDemographicsClass = !$scope.toggleDemographicsClass;
            };

            $scope.onConditionsClick= function(){
                $scope.collapseConditions = $scope.collapseConditions === "collapse" ? '' : 'collapse';
                $scope.toggleConditionsClass = !$scope.toggleConditionsClass;
            };

            $scope.onSocialHistoryClick = function(){
                $scope.collapseSocialhistory = $scope.collapseSocialhistory === "collapse" ? '' : 'collapse';
                $scope.toggleSocialhistoryClass = !$scope.toggleSocialhistoryClass;
            };

            $scope.onProcedureClick = function(){
                $scope.collapseProcedure = $scope.collapseProcedure === "collapse" ? '' : 'collapse';
                $scope.toggleProcedureClass = !$scope.toggleProcedureClass;
            };

            PatientService.get($scope.selectedPatientId,
                function(patient){
                    $scope.patient = patient;
                    $scope.populateCustomPatientMenu(patient);
                    $scope.selectSummaryRecordMenu();

                    if($scope.selectedPatientId) {
                        $scope.conditions = loadedData[0];
                        $scope.socialhistories = loadedData[1];
                        $scope.procedures = loadedData[2];

                        $scope.noCondition = loadedData[0].length === 0? true: false;
                        $scope.noSocialHistory = loadedData[1].length === 0? true: false;
                        $scope.noProcedure = loadedData[2].length === 0? true: false;
                    }
                },
                errorCallback
            );

        }else {
            $log.info("PatientCtrl: patientId not defined." );
        }
    }])
    ;
