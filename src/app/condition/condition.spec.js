'use strict';

describe('bham.conditionModule', function () {
    var module;

    beforeEach(function () {
        module = angular.module("bham.conditionModule");
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
            dependencies = module.value('bham.conditionModule').requires;
        });

        it("should have ngResource as a dependency", function () {
            expect(hasModule('ngResource')).toEqual(true);
        });

        it("should have bham.conditionService as a dependency", function () {
            expect(hasModule('bham.conditionService')).toEqual(true);
        });

        it("should have bham.conditionDirectives as a dependency", function () {
            expect(hasModule('bham.conditionDirectives')).toEqual(true);
        });

        it("should have bham.filters as a dependency", function () {
            expect(hasModule('bham.filters')).toEqual(true);
        });

        it("should have bham.naturalSort as a dependency", function () {
            expect(hasModule('bham.naturalSort')).toEqual(true);
        });
    });

});

describe("bham.conditionModule ConditionListCtrl", function () {
    beforeEach(module('ngRoute'));
    beforeEach(module('bham.conditionModule'));

    var scope, $controller, mockConditionService, conditionListCtrl, $route, $compile, mockLoadedConditions, conditions, conditionCodes, statusCodes;

    beforeEach(inject(function (_$compile_, $rootScope, _$controller_, _$route_) {
        scope = $rootScope.$new();
        $controller = _$controller_;
        $route = _$route_;
        $compile = _$compile_;

        conditions = [
            {id: "1", name: "c1"},
            {id: "2", name: "c2"},
            {id: "4", name: "c4"} //to be deleted
        ];

        conditionCodes = [
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

        mockConditionService = {
            query: function (conditionId, successCb, errorCb) {
                return conditions;
            },

            create: function (conditionId, condition, successCb, errorCb) {
                return {status: 201};
            },

            get: function (id, successCb, errorCb) {
                for (var i = 0; i < conditions.length; i++) {
                    if (conditions[i].id === id) {
                        return conditions[i];
                    }
                }
            },

            update: function (id, condition, successCb, errorCb) {
                return {status: 200};
            },

            delete: function (id, successCb, errorCb) {
                conditions.splice(id, 1);
                return {status: 200};
            },

            getProblems: function (successCb, errorCb) {
                return conditionCodes;
            },

            getProblemStatusCodes: function (successCb, errorCb) {
                return statusCodes;
            }
        };

        mockLoadedConditions = mockConditionService.query(213, successCb, errorCb);

        scope.selectedPatientId = 213;

        conditionListCtrl = $controller('ConditionListCtrl', {
            $scope: scope,
            ConditionService: mockConditionService,
            loadedConditions: mockLoadedConditions
        });
    }));

    it('should retrieve a list of conditions', function () {
        expect(scope.conditions.length).toBeGreaterThan(0);
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
        scope.sort('problemDisplayName');
        expect(scope.reverse).toBeFalsy();
        scope.sort('problemDisplayName');
        expect(scope.reverse).toBeTruthy();
    });

    it('should sort by status column', function () {
        scope.sort('problemStatusCode');
        expect(scope.reverse).toBeFalsy();
        scope.sort('problemStatusCode');
        expect(scope.reverse).toBeTruthy();
    });

    it('should sort by startDate column', function () {
        scope.sort('startDate');
        expect(scope.reverse).toBeFalsy();
        scope.sort('startDate');
        expect(scope.reverse).toBeTruthy();
    });

    it('should sort by endDate column', function () {
        scope.sort('endDate');
        expect(scope.reverse).toBeFalsy();
        scope.sort('endDate');
        expect(scope.reverse).toBeTruthy();
    });

    it('should delete a condition', function () {
        scope.deleteCondition(4);
        var condition = mockConditionService.get(4);
        expect(condition).toEqual(undefined);
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

describe("bham.conditionModule ConditionEditCtrl", function () {
    beforeEach(module('ngRoute'));
    beforeEach(module('bham.conditionModule'));

    var scope, $controller, mockConditionService, ConditionEditCtrl, $route, $compile, form, conditions, conditionCodes, statusCodes, condition, loadedData;

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

        conditions = [
            {id: "1", name: "c1"},
            {id: "2", name: "c2"}
        ];

        conditionCodes = [
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

        mockConditionService = {
            query: function (conditionId, successCb, errorCb) {
                return conditions;
            },

            create: function (conditionId, condition, successCb, errorCb) {
                return {status: 201};
            },

            get: function (id, successCb, errorCb) {
                for (var i = 0; i < conditions.length; i++) {
                    if (conditions[i].id === id) {
                        return conditions[i];
                    }
                }
            },

            update: function (id, condition, successCb, errorCb) {
                return {status: 200};
            },

            delete: function (id, successCb, errorCb) {
                return {status: 200};
            },

            getProblems: function (successCb, errorCb) {
                return conditionCodes;
            },

            getProblemStatusCodes: function (successCb, errorCb) {
                return statusCodes;
            }
        };

        //loadedData is pre-populated when ConditionEditCtrl is called.
        loadedData = [conditionCodes, statusCodes, conditions[0]];

        ConditionEditCtrl = $controller('ConditionEditCtrl', {
            $scope: scope,
            ConditionService: mockConditionService,
            loadedData: loadedData
        });

    }));

    it('Should contain default values for dropdown and the selected condition', function () {
        expect(scope.problems).toEqualData(conditionCodes);
        expect(scope.problemStatusCodes).toEqualData(statusCodes);
        expect(scope.condition).toEqualData(conditions[0]);
    });

    it('Should edit a condition', function () {
        scope.save(conditions[0]);
        var editedCondition = mockConditionService.get(conditions[0].id);
        expect(editedCondition).toEqualData(conditions[0]);
    });


});

describe("bham.conditionModule ConditionCreateCtrl", function () {
    beforeEach(module('ngRoute'));
    beforeEach(module('bham.conditionModule'));

    var scope, $controller, mockConditionService, ConditionCreateCtrl, $route, $compile, form, conditions, conditionCodes, statusCodes, condition, loadedData;

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

        conditions = [
            {id: "1", name: "c1"},
            {id: "2", name: "c2"}
        ];

        conditionCodes = [
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

        mockConditionService = {
            query: function (conditionId, successCb, errorCb) {
                return conditions;
            },

            create: function (conditionId, condition, successCb, errorCb) {
                conditions.push(condition);
                return {status: 201};
            },

            get: function (id, successCb, errorCb) {
                for (var i = 0; i < conditions.length; i++) {
                    if (conditions[i].id === id) {
                        return conditions[i];
                    }
                }
            },

            update: function (id, condition, successCb, errorCb) {
                return {status: 200};
            },

            delete: function (id, successCb, errorCb) {
                return {status: 200};
            },

            getProblems: function (successCb, errorCb) {
                return conditionCodes;
            },

            getProblemStatusCodes: function (successCb, errorCb) {
                return statusCodes;
            }
        };

        //loadedData is pre-populated when ConditionEditCtrl is called.
        loadedData = [conditionCodes, statusCodes];

        scope.selectedPatientId = 213;

        ConditionCreateCtrl = $controller('ConditionCreateCtrl', {
            $scope: scope,
            ConditionService: mockConditionService,
            loadedData: loadedData
        });

    }));

    it('Should contain default values for dropdown and the selected condition', function () {
        expect(scope.problems).toEqualData(conditionCodes);
        expect(scope.problemStatusCodes).toEqualData(statusCodes);
    });

    xit('Should create a condition', function () {
        var newCondition = {id: "3", name: "c3"};
        scope.save(newCondition);
        var retrievedCondition = mockConditionService.get(newCondition.id);
        expect(newCondition).toEqualData(retrievedCondition);
    });


});
