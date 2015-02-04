'use strict';

describe('bham.conditionService', function () {
    var module;

    beforeEach(function () {
        module = angular.module("bham.conditionService");
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
            dependencies = module.value('bham.conditionService').requires;
        });

        it("should have ngResource as a dependency", function () {
            expect(hasModule('ngResource')).toEqual(true);
        });
    });
});

describe('Condition Resource', function () {
    var mockConditionService, $httpBackend;

    beforeEach(module('bham.conditionService'));

    beforeEach(function () {
        angular.mock.inject(function ($injector) {
            $httpBackend = $injector.get('$httpBackend');
            mockConditionService = $injector.get('ConditionService');
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

    //Testing query condition
    it('should get list of conditions', inject(function () {
        var conditions = [
            {name: "C1"},
            {name: "C2"}
        ];

        $httpBackend.expectGET('http://bhamdevtest001:8087/bham/problems/patient/213').respond(conditions);

        var result = mockConditionService.query(
            213,
            function (data) {
                result = data;
            },
            function (error) {
            });

        $httpBackend.flush();
        expect(result).toEqualData(conditions);
    }));

    //Testing create condition
    it('should create a new condition', inject(function () {
        var condition = {name: "C1"};
        $httpBackend.expectPOST('http://bhamdevtest001:8087/bham/problems/patient/213').respond({status: 201});

        var status = mockConditionService.create(
            213,
            condition,
            function (data) {
                status = data.status;
            },
            function (error) {
            });

        $httpBackend.flush();
        expect(status).toEqual(201);
    }));

    //Testing get condition
    it('should get a specific condition', inject(function () {
        var condition = {name: "C1"};

        $httpBackend.expectGET('http://bhamdevtest001:8087/bham/problems/1').respond(condition);

        var result = mockConditionService.get(
            1,
            function (data) {
                result = data;
            },
            function (error) {
            });

        $httpBackend.flush();
        expect(result).toEqualData(condition);
    }));


    //Testing update condition
    it('should update a condition', inject(function () {
        var condition = {name: "C1"};
        $httpBackend.expectPUT('http://bhamdevtest001:8087/bham/problems/213').respond({status: 200});

        var status = mockConditionService.update(
            213,
            condition,
            function (data) {
                status = data.status;
            },
            function (error) {
            }
        );

        $httpBackend.flush();
        expect(status).toEqual(200);
    }));

    //Testing delete condition
    it('should delete a condition', inject(function () {
        $httpBackend.expectDELETE('http://bhamdevtest001:8087/bham/problems/100').respond({status: 200});

        var status = mockConditionService.delete(
            100,
            function (data) {
                status = data.status;
            },
            function (error) {
            }
        );

        $httpBackend.flush();
        expect(status).toEqual(200);
    }));

    //Testing get problem codes
    it('should get all problem codes', inject(function () {
        var problemcodes = [
            {code: "C1", name: "s1"},
            {code: "C2", name: "s2"}
        ];

        $httpBackend.expectGET('http://bhamdevtest001:8087/bham/problemcodes').respond(problemcodes);

        var result = mockConditionService.getProblems(
            function (data) {
                result = data;
            },
            function (error) {
            }
        );

        $httpBackend.flush();
        expect(result).toEqualData(problemcodes);
    }));

    //Testing get problem status codes
    it('should get all problem status codes', inject(function () {
        var statuscodes = [
            {code: "C1", name: "s1"},
            {code: "C2", name: "s2"}
        ];

        $httpBackend.expectGET('http://bhamdevtest001:8087/bham/actstatuscodes').respond(statuscodes);

        var result = mockConditionService.getProblemStatusCodes(
            function (data) {
                result = data;
            },
            function (error) {
            }
        );

        $httpBackend.flush();
        expect(result).toEqualData(statuscodes);
    }));

    //getConditionResource
    it('should get all conditions using getConditionResource', function () {
        var conditions = [
            {name: "C1"},
            {name: "C2"}
        ];
        $httpBackend.expectGET('http://bhamdevtest001:8087/bham/problems/patient/213').respond(conditions);
        var conditionResource = mockConditionService.getConditionResource();
        var result = conditionResource.query(
            {patientId: 213},
            function (data) {
                result = data;
            },
            function (error) {

            });
        $httpBackend.flush();
        expect(result).toEqualData(conditions);
    });

    //getProblemCodeResource
    it('should get all problem codes using getProblemCodeResource', function () {
        var problemcodes = [
            {code: "C1", name: "s1"},
            {code: "C2", name: "s2"}
        ];
        $httpBackend.expectGET('http://bhamdevtest001:8087/bham/problemcodes').respond(problemcodes);
        var problemCodeResource = mockConditionService.getProblemCodeResource();
        var result = problemCodeResource.query(
            function (data) {
                result = data;
            },
            function (error) {
            }
        );
        $httpBackend.flush();
        expect(result).toEqualData(problemcodes);
    });

    //getProblemStatusCodeResource
    it('should get all problem status codes using getProblemStatusCodeResource', function () {
        var problemstatuscodes = [
            {code: "C1", name: "s1"},
            {code: "C2", name: "s2"}
        ];
        $httpBackend.expectGET('http://bhamdevtest001:8087/bham/actstatuscodes').respond(problemstatuscodes);
        var problemStatusCodeResource = mockConditionService.getProblemStatusCodeResource();
        var result = problemStatusCodeResource.query(
            function (data) {
                result = data;
            },
            function (error) {
            }
        );
        $httpBackend.flush();
        expect(result).toEqualData(problemstatuscodes);
    });

    //getConditionOnlyResource
    it('should get all conditions using getConditionOnlyResource', function () {
        var conditions = [
            {name: "C1"},
            {name: "C2"}
        ];

        $httpBackend.expectGET('http://bhamdevtest001:8087/bham/problems/213').respond(conditions);
        var conditionOnlyResource = mockConditionService.getConditionOnlyResource();
        var result = conditionOnlyResource.query(
            {id: 213},
            function (data) {
                result = data;
            },
            function (error) {

            }
        );
        $httpBackend.flush();
        expect(result).toEqualData(conditions);
    });


});
