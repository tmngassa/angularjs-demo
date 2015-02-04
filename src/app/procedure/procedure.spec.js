'use strict';

describe('bham.procedureModule', function () {
    var module;

    beforeEach(function () {
        module = angular.module("bham.procedureModule");
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
            dependencies = module.value('bham.procedureModule').requires;
        });

        it("should have ngResource as a dependency", function () {
            expect(hasModule('ngResource')).toEqual(true);
        });

        it("should have bham.procedureService as a dependency", function () {
            expect(hasModule('bham.procedureService')).toEqual(true);
        });

        it("should have bham.procedureDirectives as a dependency", function () {
            expect(hasModule('bham.procedureDirectives')).toEqual(true);
        });

        it("should have bham.filters as a dependency", function () {
            expect(hasModule('bham.filters')).toEqual(true);
        });

        it("should have bham.naturalSort as a dependency", function () {
            expect(hasModule('bham.naturalSort')).toEqual(true);
        });
    });

});

describe("bham.procedureModule ProcedureListCtrl", function () {
    beforeEach(module('ngRoute'));
    beforeEach(module('bham.procedureModule'));

    var scope, $controller, mockProcedureService, procedureListCtrl, $route, $compile, mockLoadedProcedures, procedures, procedureCodes, statusCodes;

    beforeEach(inject(function (_$compile_, $rootScope, _$controller_, _$route_) {
        scope = $rootScope.$new();
        $controller = _$controller_;
        $route = _$route_;
        $compile = _$compile_;

        procedures = [
            {id: "1", name: "c1"},
            {id: "2", name: "c2"},
            {id: "4", name: "c4"} //to be deleted
        ];

        procedureCodes = [
            {"code": "c1", "displayName": "d1"},
            {"code": "c2", "displayName": "d2"}
        ];

        statusCodes = [
            {"code": "s1", "displayName": "d1"},
            {"code": "s2", "displayName": "d2"}
        ];

        var successCb = function () {
            console.log('Success');
        };

        var errorCb = function () {
            console.log('Error');
        };

        mockProcedureService = {
            query: function (patientId, successCb, errorCb) {
                return procedures;
            },

            create: function (patientId, procedure, successCb, errorCb) {
                return {status: 201};
            },

            get: function (id, successCb, errorCb) {
                for (var i = 0; i < procedures.length; i++) {
                    if (procedures[i].id === id) {
                        return procedures[i];
                    }
                }
            },

            update: function (id, procedure, successCb, errorCb) {
                return {status: 200};
            },

            delete: function (id, successCb, errorCb) {
                procedures.splice(id, 1);
                return {status: 200};
            },

            getProcedureCodes: function (successCb, errorCb) {
                return procedureCodes;
            },

            getProcedureStatusCodes: function (successCb, errorCb) {
                return statusCodes;
            }
        };

        mockLoadedProcedures = mockProcedureService.query(213, successCb, errorCb);

        scope.selectedPatientId = 213;

        procedureListCtrl = $controller('ProcedureListCtrl', {
            $scope: scope,
            ProcedureService: mockProcedureService,
            loadedProcedures: mockLoadedProcedures
        });
    }));

    it('should retrieve a list of procedures', function () {
        expect(scope.procedures.length).toBeGreaterThan(0);
        expect(scope.pageSize).toEqual(10);
        expect(scope.reverse).toBeFalsy();
        expect(scope.sortField).toBeUndefined();
        expect(scope.pageNo).toEqual(0);
        expect(scope.lastPage).toEqual(0);
        expect(scope.firstPage).toEqual(0);
        expect(scope.pages).toEqual([]);
        expect(scope.pages.length).toEqual(0);
    });

    it('should sort by name column', function () {
        scope.sort('procedureTypeName');
        expect(scope.reverse).toBeFalsy();
        scope.sort('procedureTypeName');
        expect(scope.reverse).toBeTruthy();
    });

    it('should sort by status column', function () {
        scope.sort('procedureStatusCode');
        expect(scope.reverse).toBeFalsy();
        scope.sort('procedureStatusCode');
        expect(scope.reverse).toBeTruthy();
    });

    it('should sort by startDate column', function () {
        scope.sort('procedureStartDate');
        expect(scope.reverse).toBeFalsy();
        scope.sort('procedureStartDate');
        expect(scope.reverse).toBeTruthy();
    });

    it('should sort by endDate column', function () {
        scope.sort('procedureEndDate');
        expect(scope.reverse).toBeFalsy();
        scope.sort('procedureEndDate');
        expect(scope.reverse).toBeTruthy();
    });

    it('should delete a procedure', function () {
        scope.deleteProcedure(4);
        var procedure = mockProcedureService.get(4);
        expect(procedure).toEqual(undefined);
    });

    it('should search by name', function () {
        scope.searchBy = 'name';
        scope.criteria = 'c1';
        scope.onSearch();
        expect(scope.composedCriteria).toNotEqual(undefined);
    });

    it('should search by status', function () {
        scope.searchBy = 'status';
        scope.criteria = 'c1';
        scope.onSearch();
        expect(scope.composedCriteria).toNotEqual(undefined);
    });

    it('should search by everything', function () {
        scope.searchBy = undefined;
        scope.criteria = 'c1';
        scope.onSearch();
        expect(scope.composedCriteria).toNotEqual(undefined);
    });

});

describe("bham.procedureModule ProcedureEditCtrl", function () {
    beforeEach(module('ngRoute'));
    beforeEach(module('bham.procedureModule'));

    var scope, $controller, mockProcedureService, ProcedureEditCtrl, $route, $compile, form, procedures, procedureCodes, statusCodes, procedure, loadedData;

    beforeEach(function () {
        this.addMatchers({
            toEqualData: function (expected) {
                return angular.equals(this.actual, expected);
            }
        });
    });

    beforeEach(inject(function (_$compile_, $rootScope, _$controller_, _$route_) {
        scope = $rootScope.$new();
        $controller = _$controller_;
        $route = _$route_;
        $compile = _$compile_;

        procedures = [
            {id: "1", name: "c1"},
            {id: "2", name: "c2"}
        ];

        procedureCodes = [
            {"code": "c1", "displayName": "d1"},
            {"code": "c2", "displayName": "d2"}
        ];

        statusCodes = [
            {"code": "s1", "displayName": "d1"},
            {"code": "s2", "displayName": "d2"}
        ];

        var successCb = function () {
            console.log('Success');
        };

        var errorCb = function () {
            console.log('Error');
        };

        mockProcedureService = {
            query: function (procedureId, successCb, errorCb) {
                return procedures;
            },

            create: function (procedureId, procedure, successCb, errorCb) {
                return {status: 201};
            },

            get: function (id, successCb, errorCb) {
                for (var i = 0; i < procedures.length; i++) {
                    if (procedures[i].id === id) {
                        return procedures[i];
                    }
                }
            },

            update: function (id, procedure, successCb, errorCb) {
                return {status: 200};
            },

            delete: function (id, successCb, errorCb) {
                procedures.splice(id, 1);
                return {status: 200};
            },

            getProcedureCodes: function (successCb, errorCb) {
                return procedureCodes;
            },

            getProcedureStatusCodes: function (successCb, errorCb) {
                return statusCodes;
            }
        };

        //loadedData is pre-populated when ProcedureEditCtrl is called.
        loadedData = [procedureCodes, statusCodes, procedures[0]];

        ProcedureEditCtrl = $controller('ProcedureEditCtrl', {
            $scope: scope,
            ProcedureService: mockProcedureService,
            loadedData: loadedData
        });

    }));

    it('Should contain default values for dropdown and the selected procedure', function () {
        expect(scope.procedureCodes).toEqualData(procedureCodes);
        expect(scope.procedureStatusCodes).toEqualData(statusCodes);
        expect(scope.procedure).toEqualData(procedures[0]);
    });

    it('Should edit a procedure', function () {
        scope.save(procedures[0]);
        var editedProcedure = mockProcedureService.get(procedures[0].id);
        expect(editedProcedure).toEqualData(procedures[0]);
    });


});

describe("bham.procedureModule ProcedureCreateCtrl", function () {
    beforeEach(module('ngRoute'));
    beforeEach(module('bham.procedureModule'));

    var scope, $controller, mockProcedureService, ProcedureCreateCtrl, $route, $compile, form, procedures, procedureCodes, statusCodes, procedure, loadedData;

    beforeEach(function () {
        this.addMatchers({
            toEqualData: function (expected) {
                return angular.equals(this.actual, expected);
            }
        });
    });

    beforeEach(inject(function (_$compile_, $rootScope, _$controller_, _$route_) {
        scope = $rootScope.$new();
        $controller = _$controller_;
        $route = _$route_;
        $compile = _$compile_;

        procedures = [
            {id: "1", name: "c1"},
            {id: "2", name: "c2"}
        ];

        procedureCodes = [
            {"code": "c1", "displayName": "d1"},
            {"code": "c2", "displayName": "d2"}
        ];

        statusCodes = [
            {"code": "s1", "displayName": "d1"},
            {"code": "s2", "displayName": "d2"}
        ];

        var successCb = function () {
            console.log('Success');
        };

        var errorCb = function () {
            console.log('Error');
        };

        mockProcedureService = {
            query: function (procedureId, successCb, errorCb) {
                return procedures;
            },

            create: function (procedureId, procedure, successCb, errorCb) {
                procedures.push(procedure);
                return {status: 201};
            },

            get: function (id, successCb, errorCb) {
                for (var i = 0; i < procedures.length; i++) {
                    if (procedures[i].id === id) {
                        return procedures[i];
                    }
                }
            },

            update: function (id, procedure, successCb, errorCb) {
                return {status: 200};
            },

            delete: function (id, successCb, errorCb) {
                procedures.splice(id, 1);
                return {status: 200};
            },

            getProcedureCodes: function (successCb, errorCb) {
                return procedureCodes;
            },

            getProcedureStatusCodes: function (successCb, errorCb) {
                return statusCodes;
            }
        };

        //loadedData is pre-populated when ProcedureEditCtrl is called.
        loadedData = [procedureCodes, statusCodes];

        scope.selectedPatientId = 213;

        ProcedureCreateCtrl = $controller('ProcedureCreateCtrl', {
            $scope: scope,
            ProcedureService: mockProcedureService,
            loadedData: loadedData
        });

    }));

    it('Should contain default values for dropdown and the selected procedure', function () {
        expect(scope.procedureCodes).toEqualData(procedureCodes);
        expect(scope.procedureStatusCodes).toEqualData(statusCodes);
    });

    it('Should create a procedure', function () {
        var newProcedure = {id: "3", name: "c3"};
        scope.save(newProcedure);
        var retrievedProcedure = mockProcedureService.get(newProcedure.id);
        expect(newProcedure).toEqualData(retrievedProcedure);
    });


});
