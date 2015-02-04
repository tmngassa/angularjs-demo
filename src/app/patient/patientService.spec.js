/**
* Created by tomson.ngassa on 3/3/14.
*/

'use strict';

describe('bham.patientService', function(){
    var module;

    beforeEach(function() {
        module = angular.module("bham.patientService");
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
            dependencies = module.value('bham.patientService').requires;
        });

        it("should have ngResource as a dependency", function() {
            expect(hasModule('ngResource')).toEqual(true);
        });
    });
});

describe('Patient Resource', function(){
    var mockPatientService, $httpBackend;

    beforeEach(module('bham.patientService'));

    beforeEach(function () {
        angular.mock.inject(function ($injector) {
            $httpBackend = $injector.get('$httpBackend');
            mockPatientService = $injector.get('PatientService');
        });
    });

    beforeEach(function(){
        this.addMatchers({
            toEqualData: function(expected) {
                return angular.equals(this.actual, expected);
            }
        });
    });

    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    it('should get patient by patientId', inject(function () {
        var patient = {firstName: "Tomson",id: 204, lastName: "Ngassa"};
        $httpBackend.expectGET("http://bhamdevtest001:8087/bham/patients/204").respond(patient);
        var result = mockPatientService.get(204);
        $httpBackend.flush();
        expect(result).toEqualData(patient);
    }));

    it('should create a new patient', inject(function () {
        var patient = {firstName: "Tomson",lastName: "Ngassa"};
        $httpBackend.expectPOST('http://bhamdevtest001:8087/bham/patients').respond({status: 201});
        var status = mockPatientService.create(
            patient,
            function(data ){
                status = data.status;
            },
            function(error){});
        $httpBackend.flush();
        expect(status).toEqual(201);
    }));

    it('should update a patient', inject(function () {
        var patient = {firstName: "Tomson Mosongo", id: 204, lastName: "Ngassa"};
        $httpBackend.expectPUT('http://bhamdevtest001:8087/bham/patients/204').respond({status: 200});
        var status = mockPatientService.update(204, patient,
            function(data ){
                status = data.status;
            },
            function(error){});
        $httpBackend.flush();
        expect(status).toEqual(200);
    }));

    it('should delete a patient', inject(function () {
        $httpBackend.expectDELETE('http://bhamdevtest001:8087/bham/patients/204').respond({status: 200});
        var status = mockPatientService.delete(204,
            function(data ){
                status = data.status;
            },
            function(error){});
        $httpBackend.flush();
        expect(status).toEqual(200);
    }));

    it('should get list states', inject(function () {
        var states = [{"code": "AL","displayName": "ALABAMA"},{"code": "AK","displayName": "ALASKA"},{"code": "AZ","displayName": "ARIZONA"}];
        $httpBackend.expectGET('http://bhamdevtest001:8087/bham/statecodes').respond(states);
        var stateResource = mockPatientService.getStateResource();
        var result = stateResource.query(
            function(data ){
                result = data;
            },
            function(error){} );
        $httpBackend.flush();
        expect(result).toEqualData(states);
    }));

    it('should get list races', inject(function () {
        var races = [{"code": "1002-5","displayName": "American Indian or Alaska Native"},{"code": "2028-9","displayName": "Asian"}];
        $httpBackend.expectGET('http://bhamdevtest001:8087/bham/racecodes').respond(races);
        var raceResource = mockPatientService.getRaceResource();
        var result = raceResource.query(
            function(data ){
                result = data;
            },
            function(error){});
        $httpBackend.flush();
        expect(result).toEqualData(races);
    }));

    it('should get list of patients', inject(function () {
        var patients = [{firstName: "Tomson",id: 204,lastName: "Ngassa"},{ firstName: "Tomson",id: 204,lastName: "Ngassa"}];
        $httpBackend.expectGET('http://bhamdevtest001:8087/bham/patients').respond(patients);
        var patientResource = mockPatientService.getPatientResource();
        var result = patientResource.query(function(data){result = data;},function(error){});
        $httpBackend.flush();
        expect(result).toEqualData(patients);
    }));

    it('should get list of decision data', inject(function () {
        var wekaResponse = { "recommendations": [
            {   "patientGoal": {"shortTermGoal": "Reduce fequency and quantity of substances taken"},
                "objectives": ["Client is no longer exhibiting any signs or symptons of subtance intoxication or withdrawal"],
                "procedureCode": {"code": "H0006"},
                "probabilityDistributionList": [{"probability": "0.34","service": "H0018","description": "Behavioral health; short-term residential"}]
            }
        ]};

        $httpBackend.expectGET('http://bhamdevtest001:8087/decisionservice/I10/2.16.840.1.113883.6.3/2/1002-5/Male/F11.20/21075').respond(wekaResponse);
        var wekaObject = {problemCode:'I10',problemCodeSystem:'2.16.840.1.113883.6.3',age:'2',race:'1002-5',genderCode:'Male',zipCode: '21075',socialHistoryCode: 'F11.20'};
        var result = mockPatientService.queryWeka(wekaObject,function(data){result = data;},function(error){});

        $httpBackend.flush();
        expect(result).toEqualData(wekaResponse);
    }));
});
