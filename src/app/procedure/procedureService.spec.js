'use strict';

describe('bham.procedureService', function () {
    var module;

    beforeEach(function () {
        module = angular.module("bham.procedureService");
    });

    it("should be registered", function () {
        expect(module).not.toEqual(null);
    });

    describe("Dependencies:", function () {
        var dependencies;
        var hasModule = function (m) {
            return dependencies.indexOf(m) >= 0;
        };

        beforeEach(function () {
            dependencies = module.value('bham.procedureService').requires;
        });

        it("should have ngResource as a dependency", function () {
            expect(hasModule('ngResource')).toEqual(true);
        });
    });
});

describe('Procedure Resource', function () {
    var mockProcedureService, $httpBackend;

    beforeEach(module('bham.procedureService'));

    beforeEach(function () {
        angular.mock.inject(function ($injector) {
            $httpBackend = $injector.get('$httpBackend');
            mockProcedureService = $injector.get('ProcedureService');
        });
    });

    beforeEach(function () {
        this.addMatchers({
            toEqualData: function (expected) {
                return angular.equals(this.actual, expected);
            }
        });
    });

    afterEach(function () {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    //Testing query
    it('should get list of procedures for a patient', inject(function () {
        var procedures = [
            {name: "P1"},
            {name: "P2"}
        ];

        $httpBackend.expectGET('http://bhamdevtest001:8087/bham/procedureobservations/patient/213').respond(procedures);

        var result = mockProcedureService.query(
            213,
            function (data) {
                result = data;
            },
            function (error) {
            });

        $httpBackend.flush();
        expect(result).toEqualData(procedures);
    }));

    //Testing create
    it('should create a new procedure for a patient', inject(function () {
        var procedure = {name: "P1"};
        $httpBackend.expectPOST('http://bhamdevtest001:8087/bham/procedureobservations/patient/213').respond({status: 201});

        var status = mockProcedureService.create(
            213,
            procedure,
            function (data) {
                status = data.status;
            },
            function (error) {
            });

        $httpBackend.flush();
        expect(status).toEqual(201);
    }));

    //Testing get
    it('should get a specific procedure', inject(function () {
        var procedure = {name: "P1"};

        $httpBackend.expectGET('http://bhamdevtest001:8087/bham/procedureobservations/patient/213').respond(procedure);

        var result = mockProcedureService.get(
            213,
            function (data) {
                result = data;
            },
            function (error) {
            });

        $httpBackend.flush();
        expect(result).toEqualData(procedure);
    }));

    //Testing update
    it('should update a specific procedure', inject(function () {
        var procedure = {name: "P1"};

        $httpBackend.expectPUT('http://bhamdevtest001:8087/bham/procedureobservations/213').respond({status: 200});

        var status = mockProcedureService.update(
            213,
            procedure,
            function (data) {
                status = data.status;
            },
            function (error) {
            });

        $httpBackend.flush();
        expect(status).toEqual(200);
    }));

    //Testing delete
    it('should delete a specific procedure', inject(function () {
        var procedure = {name: "P1"};

        $httpBackend.expectDELETE('http://bhamdevtest001:8087/bham/procedureobservations/213').respond({status: 200});

        var status = mockProcedureService.delete(
            213,
            function (data) {
                status = data.status;
            },
            function (error) {
            });

        $httpBackend.flush();
        expect(status).toEqual(200);
    }));

    //Testing get procedure codes
    it('should get all procedure codes', inject(function () {
        var procedurecodes = [
            {code: "C1", name: "s1"},
            {code: "C2", name: "s2"}
        ];

        $httpBackend.expectGET('http://bhamdevtest001:8087/bham/proceduretypecodes').respond(procedurecodes);

        var result = mockProcedureService.getProcedureCodes(
            function (data) {
                result = data;
            },
            function (error) {
            }
        );

        $httpBackend.flush();
        expect(result).toEqualData(procedurecodes);
    }));

    //Testing get procedure status codes
    it('should get all procedure status codes', inject(function () {
        var procedurestatuscodes = [
            {code: "C1", name: "s1"},
            {code: "C2", name: "s2"}
        ];

        $httpBackend.expectGET('http://bhamdevtest001:8087/bham/actstatuscodes').respond(procedurestatuscodes);

        var result = mockProcedureService.getProcedureStatusCodes(
            function (data) {
                result = data;
            },
            function (error) {
            }
        );

        $httpBackend.flush();
        expect(result).toEqualData(procedurestatuscodes);
    }));

    //getProcedureResource
    it('should get all procedures using getProcedureResource', function () {
        var procedures = [
            {name: "C1"},
            {name: "C2"}
        ];
        $httpBackend.expectGET('http://bhamdevtest001:8087/bham/procedureobservations/patient/213').respond(procedures);
        var procedureResource = mockProcedureService.getProcedureResource();
        var result = procedureResource.query(
            {patientId: 213},
            function (data) {
                result = data;
            },
            function (error) {

            });
        $httpBackend.flush();
        expect(result).toEqualData(procedures);
    });

    //getProcedureCodeResource
    it('should get all procedure codes using getProcedureCodeResource', function () {
        var procedurecodes = [
            {code: "C1", name: "s1"},
            {code: "C2", name: "s2"}
        ];
        $httpBackend.expectGET('http://bhamdevtest001:8087/bham/proceduretypecodes').respond(procedurecodes);
        var procedureCodeResource = mockProcedureService.getProcedureCodeResource();
        var result = procedureCodeResource.query(
            function (data) {
                result = data;
            },
            function (error) {
            }
        );
        $httpBackend.flush();
        expect(result).toEqualData(procedurecodes);
    });

    //getProcedureStatusCodeResource
    it('should get all procedure status codes using getProcedureStatusCodeResource', function () {
        var procedurestatuscodes = [
            {code: "C1", name: "s1"},
            {code: "C2", name: "s2"}
        ];
        $httpBackend.expectGET('http://bhamdevtest001:8087/bham/actstatuscodes').respond(procedurestatuscodes);
        var procedureStatusCodeResource = mockProcedureService.getProcedureStatusCodeResource();
        var result = procedureStatusCodeResource.query(
            function (data) {
                result = data;
            },
            function (error) {
            }
        );
        $httpBackend.flush();
        expect(result).toEqualData(procedurestatuscodes);
    });

    //getProcedureOnlyResource
    it('should get all procedures using getProcedureOnlyResource', function () {
        var procedures = [
            {name: "C1"},
            {name: "C2"}
        ];

        $httpBackend.expectGET('http://bhamdevtest001:8087/bham/procedureobservations/213').respond(procedures);
        var procedureOnlyResource = mockProcedureService.getProcedureOnlyResource();
        var result = procedureOnlyResource.query(
            {id: 213},
            function (data) {
                result = data;
            },
            function (error) {

            }
        );
        $httpBackend.flush();
        expect(result).toEqualData(procedures);
    });

});