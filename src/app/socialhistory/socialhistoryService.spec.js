'use strict';

describe('bham.socialhistoryService', function () {
    var module;

    beforeEach(function () {
        module = angular.module("bham.socialhistoryService");
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
            dependencies = module.value('bham.socialhistoryService').requires;
        });

        it("should have ngResource as a dependency", function () {
            expect(hasModule('ngResource')).toEqual(true);
        });
    });
});

describe('SocialHistory Resource', function () {
    var mockSocialhistoryService, $httpBackend;

    beforeEach(module('bham.socialhistoryService'));

    beforeEach(function () {
        angular.mock.inject(function ($injector) {
            $httpBackend = $injector.get('$httpBackend');
            mockSocialhistoryService = $injector.get('SocialhistoryService');
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
    it('should get list of Socialhistories for a patient', inject(function () {
        var socialhistories = [
            {name: "S1"},
            {name: "S2"},
            {name: "H3"}
        ];

        $httpBackend.expectGET('http://bhamdevtest001:8087/bham/socialhistorys/patient/213').respond(socialhistories);

        var result = mockSocialhistoryService.query(
            213,
            function (data) {
                result = data;
            },
            function (error) {
            });

        $httpBackend.flush();
        expect(result).toEqualData(socialhistories);
    }));

    //Testing create
    it('should create a new socialhistory', inject(function () {
        var socialhistory = {name: "S1"};
        $httpBackend.expectPOST('http://bhamdevtest001:8087/bham/socialhistorys/patient/213').respond({status: 201});

        var status = mockSocialhistoryService.create(
            213,
            socialhistory,
            function (data) {
                status = data.status;
            },
            function (error) {
            });

        $httpBackend.flush();
        expect(status).toEqual(201);
    }));

    //Testing get
    it('should get a specific socialhistory', inject(function () {
        var socialhistory = {name: "S1"};

        $httpBackend.expectGET('http://bhamdevtest001:8087/bham/socialhistorys/1').respond(socialhistory);

        var result = mockSocialhistoryService.get(
            1,
            function (data) {
                result = data;
            },
            function (error) {
            });

        $httpBackend.flush();
        expect(result).toEqualData(socialhistory);
    }));

    //Testing update
    it('should update a socialhistory', inject(function () {
        var socialhistory = {name: "S1"};
        $httpBackend.expectPUT('http://bhamdevtest001:8087/bham/socialhistorys/213').respond({status: 200});

        var status = mockSocialhistoryService.update(
            213,
            socialhistory,
            function (data) {
                status = data.status;
            },
            function (error) {
            }
        );

        $httpBackend.flush();
        expect(status).toEqual(200);
    }));

    //Testing delete
    it('should delete a socialhistory', inject(function () {
        $httpBackend.expectDELETE('http://bhamdevtest001:8087/bham/socialhistorys/100').respond({status: 200});

        var status = mockSocialhistoryService.delete(
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

    //Testing get socialhistory codes
    it('should get all socialhistory codes', inject(function () {
        var socialhistorytypecodes = [
            {code: "C1", name: "s1"},
            {code: "C2", name: "s2"}
        ];

        $httpBackend.expectGET('http://bhamdevtest001:8087/bham/socialhistorytypecodes').respond(socialhistorytypecodes);

        var result = mockSocialhistoryService.getSocialHistoryTypeCodes(
            function (data) {
                result = data;
            },
            function (error) {
            }
        );

        $httpBackend.flush();
        expect(result).toEqualData(socialhistorytypecodes);
    }));

    //Testing get problem status codes
    it('should get all problem status codes', inject(function () {
        var socialhistorystatuscodes = [
            {code: "C1", name: "s1"},
            {code: "C2", name: "s2"}
        ];

        $httpBackend.expectGET('http://bhamdevtest001:8087/bham/actstatuscodes').respond(socialhistorystatuscodes);

        var result = mockSocialhistoryService.getProblemStatusCodes(
            function (data) {
                result = data;
            },
            function (error) {
            }
        );

        $httpBackend.flush();
        expect(result).toEqualData(socialhistorystatuscodes);
    }));

    //getSocialHistoryResource
    it('should get all socialhistories using getSocialHistoryResource', function () {
        var socialhistories = [
            {name: "C1"},
            {name: "C2"}
        ];
        $httpBackend.expectGET('http://bhamdevtest001:8087/bham/socialhistorys/patient/213').respond(socialhistories);
        var socialhistoryResource = mockSocialhistoryService.getSocialHistoryResource();
        var result = socialhistoryResource.query(
            {patientId: 213},
            function (data) {
                result = data;
            },
            function (error) {

            });
        $httpBackend.flush();
        expect(result).toEqualData(socialhistories);
    });

    //getSocialHistoryTypeResource
    it('should get all problem codes using getSocialHistoryTypeResource', function () {
        var socialhistorycodes = [
            {code: "C1", name: "s1"},
            {code: "C2", name: "s2"}
        ];
        $httpBackend.expectGET('http://bhamdevtest001:8087/bham/socialhistorytypecodes').respond(socialhistorycodes);
        var problemCodeResource = mockSocialhistoryService.getSocialHistoryTypeResource();
        var result = problemCodeResource.query(
            function (data) {
                result = data;
            },
            function (error) {
            }
        );
        $httpBackend.flush();
        expect(result).toEqualData(socialhistorycodes);
    });

    //getProblemStatusCodeResource
    it('should get all problem status codes using getProblemStatusCodeResource', function () {
        var socialhistorystatuscodes = [
            {code: "C1", name: "s1"},
            {code: "C2", name: "s2"}
        ];
        $httpBackend.expectGET('http://bhamdevtest001:8087/bham/actstatuscodes').respond(socialhistorystatuscodes);
        var problemStatusCodeResource = mockSocialhistoryService.getProblemStatusCodeResource();
        var result = problemStatusCodeResource.query(
            function (data) {
                result = data;
            },
            function (error) {
            }
        );
        $httpBackend.flush();
        expect(result).toEqualData(socialhistorystatuscodes);
    });

    //getSocialHistoryOnlyResource
    it('should get all socialhistories using getSocialHistoryOnlyResource', function () {
        var socialhistories = [
            {name: "C1"},
            {name: "C2"}
        ];

        $httpBackend.expectGET('http://bhamdevtest001:8087/bham/socialhistorys/213').respond(socialhistories);
        var socialhistoryOnlyResource = mockSocialhistoryService.getSocialHistoryOnlyResource();
        var result = socialhistoryOnlyResource.query(
            {id: 213},
            function (data) {
                result = data;
            },
            function (error) {

            }
        );
        $httpBackend.flush();
        expect(result).toEqualData(socialhistories);
    });




});