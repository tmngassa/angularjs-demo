/**
 * Created by tomson.ngassa on 3/3/14.
 */

'use strict';

describe('bham.patientModule', function(){
    var module;

    beforeEach(function() {
        module = angular.module("bham.patientModule");
    });

    it("should be registered", function() {
        expect(module).not.toEqual(null);
    });

    describe("Dependencies:", function() {

        var dependencies;

        var hasModule = function(m) {
            return dependencies.indexOf(m) >= 0;
        };

        beforeEach(function() {
            dependencies = module.value('bham.patientModule').requires;
        });

        it("should have ngResource as a dependency", function() {
            expect(hasModule('ngResource')).toEqual(true);
        });

        it("should have bham.patientService as a dependency", function() {
            expect(hasModule('bham.patientService')).toEqual(true);
        });

        it("should have bham.patientDirectives as a dependency", function() {
            expect(hasModule('bham.patientDirectives')).toEqual(true);
        });

        it("should have bham.filters as a dependency", function() {
            expect(hasModule('bham.filters')).toEqual(true);
        });

        it("should have bham.naturalSort as a dependency", function() {
            expect(hasModule('bham.naturalSort')).toEqual(true);
        });
    });
});

describe("bham.patientModule PatientListCtrl", function() {

    beforeEach(module('ngRoute'));
    beforeEach(module('bham.patientModule'));

    beforeEach(function(){
        this.addMatchers({
            toEqualData: function(expected) {
                return angular.equals(this.actual, expected);
            }
        });
    });

    var scope, MockPatientService, spyObject;

    beforeEach(inject(function($rootScope, $controller){
        scope = $rootScope.$new();
        var patients = [
            {firstName: "Tomson",id: 214,lastName: "Ngassa"},{ firstName: "Thomas",id: 205,lastName: "Ngassa"},
            {firstName: "Tomson",id: 214,lastName: "Ngassa"},{ firstName: "Thomas",id: 205,lastName: "Ngassa"},
            {firstName: "Tomson",id: 214,lastName: "Ngassa"},{ firstName: "Thomas",id: 205,lastName: "Ngassa"},
            {firstName: "Tomson",id: 214,lastName: "Ngassa"},{ firstName: "Thomas",id: 205,lastName: "Ngassa"},
            {firstName: "Tomson",id: 214,lastName: "Ngassa"},{ firstName: "Thomas",id: 205,lastName: "Ngassa"},
            {firstName: "Tomson",id: 214,lastName: "Ngassa"},{ firstName: "Thomas",id: 205,lastName: "Ngassa"},
            {firstName: "Tomson",id: 214,lastName: "Ngassa"},{ firstName: "Thomas",id: 205,lastName: "Ngassa"},
            {firstName: "Tomson",id: 214,lastName: "Ngassa"},{ firstName: "Thomas",id: 205,lastName: "Ngassa"},
            {firstName: "Tommy",id: 206,lastName: "Ngassa"},{ firstName: "Tomson",id: 207,lastName: "Ngassa"}
        ];

        var successCb = function(){console.log('Success');};
        var errorCb =  function (){ console.log('Error');};

        MockPatientService = {
            query: function(successCb, errorCb) {
                return patients ;
            },
            create : function(patient, successCb, errorCb) {
            },
            get : function(id, successCb, errorCb) {
                for(var i = 0; i < patients.length ; i++ ){
                    if(patients[i].id === id){
                        return patients[i];
                    }
                }
            },
            update : function(id, patient, successCb, errorCb) {
                for(var i = 0; i < patients.length ; i++ ){
                    if(patients[i].id === patient.id){
                        patients.splice(i, 1, patient);
                        break;
                    }
                }
            },
            delete : function(id, successCb, errorCb) {
                patients.splice(id, 1);
            }
        };

        scope.toggleDemographicMode = function(b){
            scope.isDemographics = b;
        };

//        spyObject = jasmine.createSpyObj('PatientService', ['delete']);

        var loadedPatients = patients;
        scope.toggleDemographicMode(false);

        scope.patients = loadedPatients;
        scope.filteredPatients = loadedPatients;
        scope.totalRecords = loadedPatients.length;

        $controller('PatientListCtrl', {
            $scope: scope,
            PatientService: MockPatientService,
            loadedPatients: loadedPatients
        });


    }));

    it('should initialize default values', function(){
        expect(scope.pageSize).toEqual(10);
        expect(scope.showPageSize).toEqual(10);
        expect(scope.startRecord).toEqual(1);

        expect(scope.sortField).toBeUndefined();
        expect(scope.reverse).toBeFalsy();

        expect(scope.pages).toEqualData([]);
        expect(scope.pageNo).toEqual(0);

        expect(scope.firstPage).toEqual(0);
        expect(scope.lastPage).toEqual(0);
    });

    it('should sort by firstName column', function(){
        scope.sortField = 'firstName';
        scope.sort('firstName');
        expect(scope.reverse).toBeTruthy();
        scope.sort('firstName');
        expect(scope.reverse).toBeFalsy();

        scope.sort("");
        expect(scope.reverse).toBeFalsy();
        expect(scope.sortField).toEqual("");
    });

    it('should sort in ascending order', function(){
        scope.sortField = 'firstName';
        expect(scope.isSortUp(scope.sortField)).toBeTruthy();
        scope.sort(scope.sortField);
        expect(scope.isSortUp(scope.sortField)).toBeFalsy();
    });

    it('should sort in descending order', function(){
        scope.sortField = 'firstName';
        expect(scope.isSortDown(scope.sortField)).toBeFalsy();
        scope.sort(scope.sortField);
        expect(scope.isSortDown(scope.sortField)).toBeTruthy();
    });

    it('should change showPageSize on page size change', function(){
        scope.pageSize = 20;
        scope.onPageSizeChange();
        expect(scope.showPageSize).toEqual(18);  // Since the list of patients is 4
        expect(scope.startRecord).toEqual(1);
        expect(scope.pageNo).toEqual(0);

        scope.pageSize = 2;
        scope.onPageSizeChange();
        expect(scope.showPageSize).toEqual(2);  // Since the list of patients is 4
        expect(scope.startRecord).toEqual(1);
        expect(scope.pageNo).toEqual(0);
    });

    it('should delete the first patient', function(){
        expect(scope.patients.length).toEqual(18);
        scope.deletePatient(0);
        expect(scope.patients.length).toEqual(17);
//        expect(PatientService.delete).toHaveBeenCalled();
    });

    it('should calculate pagination pages', function(){
        scope.pages = [];
        //Create 5 pages
        for (var i=0; i<5; i++) {
            scope.pages.push(i);
        }
        scope.setActivePage(2);
        expect(scope.pageNo).toEqual(2);
    });

    it('should seach patient table', function(){
        expect(scope.pageNo).toEqual(0);
        scope.searchBy = 'administrativeGenderCodeDisplayName';
        scope.onSearch();
        expect(scope.composedCriteria).toEqual({administrativeGenderCodeDisplayName : "" + scope.criteria});

        scope.criteria = 'birthdate';
        scope.searchBy = 'addressPostalCode';
        scope.onSearch();
        expect(scope.composedCriteria).toEqual({addressPostalCode : scope.criteria});

        scope.criteria = 'birthdate';
        scope.searchBy = '';
        scope.onSearch();
        expect(scope.composedCriteria).toEqual( scope.criteria);
    });

    it("should update the showpage variable when the filter patient length changes", function(){
        expect(scope.pages).toEqual([]);
        //In case the filter size is less than the page size
        scope.filteredPatients =[
            {firstName: "Tomson",id: 214,lastName: "Ngassa"},{ firstName: "Thomas",id: 205,lastName: "Ngassa"},
            {firstName: "Tommy",id: 206,lastName: "Ngassa"}, {firstName: "Tommy",id: 206,lastName: "Ngassa"}
        ];
        scope.$apply();
        expect(scope.startRecord ).toEqual(1);
        expect(scope.showPageSize ).toEqual(4);

        //In case the filter size is more than the page size
        scope.filteredPatients =[
            {firstName: "Tomson",id: 214,lastName: "Ngassa"},{ firstName: "Thomas",id: 205,lastName: "Ngassa"},
            {firstName: "Tommy",id: 206,lastName: "Ngassa"}, {firstName: "Tommy",id: 206,lastName: "Ngassa"},
            {firstName: "Tomson",id: 214,lastName: "Ngassa"},{ firstName: "Thomas",id: 205,lastName: "Ngassa"},
            {firstName: "Tommy",id: 206,lastName: "Ngassa"}, {firstName: "Tommy",id: 206,lastName: "Ngassa"},
            {firstName: "Tomson",id: 214,lastName: "Ngassa"},{ firstName: "Thomas",id: 205,lastName: "Ngassa"},
            {firstName: "Tommy",id: 206,lastName: "Ngassa"}, {firstName: "Tommy",id: 206,lastName: "Ngassa"}
        ];
        scope.$apply();
        expect(scope.startRecord ).toEqual(1);
        expect(scope.showPageSize ).toEqual(10);
    });

    it("should update pagination pages when page size changes", function(){
        //If page size is greater than total patients
        expect(scope.pageSize).toEqual(10);
        scope.pageSize = 25;
        scope.$apply();
        expect(scope.pages).toEqual([0]);

        //If page size is less than total patients
        scope.pageSize = 15;
        scope.$apply();
        expect(scope.pages).toEqual([0, 1]);

//        scope.totalRecords = 18,
//        scope.filteredPatients = undefined;
//        scope.$apply();
//        expect(scope.pages).toEqual([0, 1])
    });
});


describe("bham.patientModule PatientEditCtrl ", function() {

    beforeEach(module('ngRoute'));
    beforeEach(module('bham.patientModule'));

    beforeEach(function(){
        this.addMatchers({
            toEqualData: function(expected) {
                return angular.equals(this.actual, expected);
            }
        });
    });

    var scope, $controller, MockPatientService, PatientEditCtrl, states, races, patient, loadedData, form;

    var setPatientFirstName = function(value) {
        scope.patient1.firstName = value;
        scope.$digest();
    };

    beforeEach(inject(function( $rootScope, _$controller_, $compile){
        scope = $rootScope.$new();
        $controller = _$controller_;

        var patients = [{firstName: "Tomson",id: 214,lastName: "Ngassa"},{ firstName: "Thomas",id: 205,lastName: "Ngassa"},
            {firstName: "Tommy",id: 206,lastName: "Ngassa"},{ firstName: "Tomson",id: 207,lastName: "Ngassa"}];

        states = [{ "code": "AL","displayName": "ALABAMA"},{ "code": "AK","displayName": "ALASKA"},{ "code": "AZ","displayName": "ARIZONA"}];

        races = [{ "code": "1002-5","displayName": "American Indian or Alaska Native"},{ "code": "2028-9", "displayName": "Asian"}];

        var successCb = function(){console.log('Success');};

        var errorCb =  function (){console.log('Error');};

        MockPatientService = {

            query: function(successCb, errorCb) {
                return patients ;
            },

            get : function(id, successCb, errorCb) {
                for(var i = 0; i < patients.length ; i++ ){
                    if(patients[i].id === id){
                        return patients[i];
                    }
                }
            },

            update : function(id, patient, successCb, errorCb) {
                for(var i = 0; i < patients.length ; i++ ){
                    if(patients[i].id === patient.id){
                        patients.splice(i, 1, patient);
                        break;
                    }
                }
            },

            delete : function(id, successCb, errorCb) {
                patients.splice(id, 1);
            },

            create : function(patient, successCb, errorCb) {
            },

            getStates: function(successCb, errorCb) {
                return states;
            },

            getRaces: function(successCb, errorCb) {
                return races;
            }
        };

        patient = patients[0];
        loadedData = [states, races, patient];
        scope.states = loadedData[0];
        scope.races = loadedData[1];
        scope.patient = loadedData[2];

        var element = angular.element(
          '<form name="patientForm" >'+
              '  <input type="text" ng-model="patient1.firstName" id="patientFirstName" required name="patientFirstName" />'+
           '</form>'
        );

        scope.patient1 = {
            firstName: ''
        };

        $compile(element)(scope);
        scope.$digest();
        form = scope.patientForm;

        PatientEditCtrl = $controller('PatientEditCtrl', {
            $scope: scope,
            PatientService:MockPatientService,
            loadedData: loadedData
        });

    }));

    it('Should contain default values', function(){
        expect(scope.states).toEqualData(states);
        expect(scope.races).toEqualData(races);
        expect(scope.patient).toEqualData(patient);
        expect(scope.showCompareDateError).toBeFalsy();
    });

    it('Should update edit patient', function(){
        var editPatient =  {firstName: "Michael",id: 214,lastName: "Jackson"};
        scope.save(editPatient);
        var newPatient = MockPatientService.get(editPatient.id);
        expect(newPatient).toEqualData(newPatient);
    });

    it('patient form should be invalid initially', function(){
        expect(form.$valid).toBeFalsy(); //because patient.firstname is required
        expect(form.patientFirstName.$dirty).toBeFalsy();
    });

    xit('Should be able to save patient form', function(){
        expect(scope.canSave()).toBeFalsy();
        setPatientFirstName("Tomson");
        expect(scope.canSave()).toBeTruthy();
    });
});

describe("bham.patientModule PatientCreateCtrl ", function() {
    beforeEach(module('ngRoute'));
    beforeEach(module('bham.patientModule'));

    var scope, $controller, MockPatientService, PatientCreateCtrl, states, races;

    beforeEach(inject(function( $rootScope, _$controller_){
        scope = $rootScope.$new();
        $controller = _$controller_;

        var patients = [{firstName: "Tomson",id: 204,lastName: "Ngassa"},{ firstName: "Thomas",id: 205,lastName: "Ngassa"},
            {firstName: "Tommy",id: 206,lastName: "Ngassa"},{ firstName: "Tomson",id: 207,lastName: "Ngassa"}];

        states = [{ "code": "AL","displayName": "ALABAMA"},{ "code": "AK","displayName": "ALASKA"},{ "code": "AZ","displayName": "ARIZONA"}];

        races = [{ "code": "1002-5","displayName": "American Indian or Alaska Native"},{ "code": "2028-9", "displayName": "Asian"}];

        var successCb = function(){console.log('Success');};

        var errorCb =  function (){console.log('Error');};

        MockPatientService = {
            query: function(successCb, errorCb) {
                return patients ;
            },
            create : function(patient, successCb, errorCb) {
                patients.push(patient);
            },
            get : function(id, successCb, errorCb) {
                return patients[0];
            },
            update : function(id, patient, successCb, errorCb) {
                patients.splice(id, 1, patient);
            },
            delete : function(id, successCb, errorCb) {
                patients.splice(id, 1);
            },
            getStates: function(successCb, errorCb) {
                return states;
            },
            getRaces: function(successCb, errorCb) {
                return races;
            }
        };

        var loadedData = [states, races];

        scope.patient = {birthDate:"04/15/2014"};

        scope.$watch('patient.birthDate', function(birthdate){
            scope.showCompareDateError = true;
        });

        PatientCreateCtrl = $controller('PatientCreateCtrl', {
            $scope: scope,
            PatientService:MockPatientService,
            loadedData: loadedData
        });

    }));

    it('Should contain default values', function(){
        expect(scope.states.length).toEqual(3);
        expect(scope.races.length).toEqual(2);
        expect(scope.showCompareDateError).toBeFalsy();
    });

    xit('Should save patient', function(){
        var patient = {firstName: "Joel",id: 227,lastName: "Amoussou"};
        expect(MockPatientService.query().length).toEqual(4);
        scope.save(patient);
        expect(MockPatientService.query().length).toEqual(5);
    });

    xit('Should be a future date', function(){
        expect(scope.showCompareDateError).toBeFalsy();
        console.log(scope.patient);
        scope.patient.birthDate = "04/20/2014";
        scope.$apply();
        expect(scope.showCompareDateError).toBeTruthy();
    });
});

describe("bham.patientModule PatientTreatmentCtrl ", function() {
    beforeEach(module('ngRoute'));
    beforeEach(module('bham.patientModule'));

    beforeEach(function(){
        this.addMatchers({
            toEqualData: function(expected) {
                return angular.equals(this.actual, expected);
            }
        });
    });

    var scope, $controller, patientTreatmentCtrl, $route, $compile, conditions, socialhistories,procedures, patient, steps, $routeParams, loadedData, $window, $location;

    beforeEach(inject(function(_$compile_, $rootScope, _$controller_, _$route_, _$routeParams_, _$window_, _$location_){
        scope = $rootScope.$new();
        $controller = _$controller_;
        $route = _$route_ ;
        $compile = _$compile_;
        $routeParams = _$routeParams_;
        $window = _$window_;
        $location = _$location_;

        patient = {firstName: "Tomson",id: 214,lastName: "Ngassa"};

        conditions = [{"endDate": "04/09/2014","id": 260,"patientFirstName": "dd","patientId": 214,"patientLastName": "Molukule","patientMedicalRecordNumber": "23322",
                      "problemCode": "I10","problemDisplayName": "Hypertension","problemName": "Hypertension","problemStatusCode": "active","startDate": "03/24/2014"}];

        socialhistories = [{"endDate": "04/01/2014","id": 1,"patientId": 214,"socialHistoryStatusCode": "cancelled","socialHistoryStatusName": "cancelled","socialHistoryTypeCode":
                          "F11.20","socialHistoryTypeName": "Opioid Use Disorder, Moderate or Severe", "startDate": "04/01/2014"}];

        procedures = [{"bodySiteCode": null,"id": 1,"patientId": 214,"procedureEndDate": "03/31/2014","procedureStartDate": "03/30/2014","procedureStatusCode": "active",
                        "procedureTypeCode": "H0018","procedureTypeName": "Behavioral health; short-term residential"}];
        steps = ['one', 'two', 'three', 'four'];


        loadedData = [conditions, socialhistories, procedures];

        scope.conditions = loadedData[0];
        scope.socialhistories = loadedData[1];
        scope.procedures = loadedData[2];

        patientTreatmentCtrl = $controller('PatientTreatmentCtrl', {
            $scope: scope,
            loadedData: loadedData
        });

    }));

    it('Should contain default values', function(){
        expect(scope.steps.length).toEqual(4);
        expect(scope.steps).toEqualData(steps);

        expect(scope.step).toEqual(0);
        expect(scope.one).toEqual('active');
        expect(scope.two).toEqual('');
        expect(scope.three).toEqual('');
        expect(scope.four).toEqual('');

        expect(scope.longTermGoal).toBeFalsy();
        expect(scope.shortTermGoal).toBeFalsy();
    });

    it('Should be first step', function(){
        var isFirst = scope.isFirstStep();
        expect(isFirst).toBeTruthy();
    });

    it('Should be last step', function(){
        scope.step = 3;
        var isLast = scope.isLastStep();
        expect(isLast).toBeTruthy();
    });

    it('Should be current step', function(){
        scope.step = 2;
        var isCurrent = scope.isCurrentStep(2);
        expect(isCurrent).toBeTruthy();
    });

    it('Should get current step', function(){
        var currentStep;

        currentStep = scope.getCurrentStep();
        expect(currentStep).toEqual('one');

        scope.step = 1;
        currentStep = scope.getCurrentStep();
        expect(currentStep).toEqual('two');

        scope.step = 2;
        currentStep = scope.getCurrentStep();
        expect(currentStep).toEqual('three');

        scope.step = 3;
        currentStep = scope.getCurrentStep();
        expect(currentStep).toEqual('four');
    });

    it('Should set current step', function(){
        scope.setCurrentStep(2);
        expect(scope.step).toEqual(2);
    });

    it('Should handle next button', function(){
        var nextLabel;
        scope.step = 1;
        nextLabel = scope.getNextLabel();
        expect(nextLabel).toEqual('Next');

        scope.step = 3;
        nextLabel = scope.getNextLabel();
        expect(nextLabel).toEqual('Submit');
    });

    it('Should handle Previous step', function(){
        scope.step = 0;
        scope.handlePrevious();
        expect(scope.step).toEqual(0);

        scope.step = 2;
        scope.handlePrevious();
        expect(scope.step).toEqual(1);

        scope.step = 3;
        scope.handlePrevious();
        expect(scope.step).toEqual(2);
    });

    xit('Should handle Next step', function(){
        scope.handleNext();
        expect(scope.step).toEqual(1);

        scope.step = 2;
        scope.handleNext();
        expect(scope.step).toEqual(3);

        scope.step = 3;
        scope.handleNext();
        expect(scope.step).toEqual(3);
    });

});


describe("bham.patientModule PatientProfileCtrl ", function() {
    beforeEach(module('ngRoute'));
    beforeEach(module('bham.patientModule'));

    beforeEach(function(){
        this.addMatchers({
            toEqualData: function(expected) {
                return angular.equals(this.actual, expected);
            }
        });
    });

    var scope, $controller, patientProfileCtrl,conditions, socialhistories,procedures, patient, loadedData, states, races, MockPatientService;

    beforeEach(inject(function( $rootScope, _$controller_){
        scope = $rootScope.$new();
        $controller = _$controller_;

        patient = {firstName: "Tomson",id: 214,lastName: "Ngassa"};
        var patients = {};

        conditions = [{"endDate": "04/09/2014","id": 260,"patientFirstName": "dd","patientId": 214,"patientLastName": "Molukule","patientMedicalRecordNumber": "23322",
            "problemCode": "I10","problemDisplayName": "Hypertension","problemName": "Hypertension","problemStatusCode": "active","startDate": "03/24/2014"}];

        socialhistories = [{"endDate": "04/01/2014","id": 1,"patientId": 214,"socialHistoryStatusCode": "cancelled","socialHistoryStatusName": "cancelled","socialHistoryTypeCode":
            "F11.20","socialHistoryTypeName": "Opioid Use Disorder, Moderate or Severe", "startDate": "04/01/2014"}];

        procedures = [{"bodySiteCode": null,"id": 1,"patientId": 214,"procedureEndDate": "03/31/2014","procedureStartDate": "03/30/2014","procedureStatusCode": "active",
            "procedureTypeCode": "H0018","procedureTypeName": "Behavioral health; short-term residential"}];

        states = [{ "code": "AL","displayName": "ALABAMA"},{ "code": "AK","displayName": "ALASKA"},{ "code": "AZ","displayName": "ARIZONA"}];

        races = [{ "code": "1002-5","displayName": "American Indian or Alaska Native"},{ "code": "2028-9", "displayName": "Asian"}];

        var successCb = function(){console.log('Success');};

        var errorCb =  function (){console.log('Error');};

        MockPatientService = {
            query: function(successCb, errorCb) {
                return patients ;
            },
            create : function(patient, successCb, errorCb) {
                patients.push(patient);
            },
            get : function(id, successCb, errorCb) {
                return patient;
            },
            update : function(id, patient, successCb, errorCb) {
                patients.splice(id, 1, patient);
            },
            delete : function(id, successCb, errorCb) {
                patients.splice(id, 1);
            },
            getStates: function(successCb, errorCb) {
                return states;
            },
            getRaces: function(successCb, errorCb) {
                return races;
            }
        };

        scope.selectedPatientId = 214;

        loadedData = [conditions, socialhistories, procedures];

        scope.conditions = loadedData[0];
        scope.socialhistories = loadedData[1];
        scope.procedures = loadedData[2];

        patientProfileCtrl = $controller('PatientProfileCtrl', {
            $scope: scope,
            PatientService: MockPatientService,
            loadedData: loadedData
        });

    }));

    it('Should contain default values', function(){
        expect(scope.collapseDemographics).toEqual('');
        expect(scope.collapseConditions).toEqual('');
        expect(scope.collapseSocialhistory).toEqual('');
        expect(scope.collapseProcedure).toEqual('');

        expect(scope.toggleDemographicsClass).toBeFalsy();
        expect(scope.toggleConditionsClass).toBeFalsy();
        expect(scope.toggleSocialhistoryClass).toBeFalsy();
        expect(scope.toggleProcedureClass).toBeFalsy();
    });

    it('Should toggle demorgaphics accordion', function(){
        expect(scope.collapseDemographics).toEqual('');
        expect(scope.toggleDemographicsClass).toBeFalsy();
        scope.onDemographicsClick();
        expect(scope.toggleDemographicsClass).toBeTruthy();
        expect(scope.collapseDemographics).toEqual('collapse');
    });

    it('Should toggle condition accordion', function(){
        expect(scope.collapseConditions).toEqual('');
        expect(scope.toggleConditionsClass).toBeFalsy();
        scope.onConditionsClick();
        expect(scope.toggleConditionsClass).toBeTruthy();
        expect(scope.collapseConditions).toEqual('collapse');
    });

    it('Should toggle social history accordion', function(){
        expect(scope.collapseSocialhistory).toEqual('');
        expect(scope.toggleSocialhistoryClass).toBeFalsy();
        scope.onSocialHistoryClick();
        expect(scope.toggleSocialhistoryClass).toBeTruthy();
        expect(scope.collapseSocialhistory).toEqual('collapse');
    });

    it('Should toggle procedure accordion', function(){
        expect(scope.collapseProcedure).toEqual('');
        expect(scope.toggleProcedureClass).toBeFalsy();
        scope.onProcedureClick();
        expect(scope.toggleProcedureClass).toBeTruthy();
        expect(scope.collapseProcedure).toEqual('collapse');
    });

});