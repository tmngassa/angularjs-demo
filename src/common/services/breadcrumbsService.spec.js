/**
 * Created by tomson.ngassa on 3/3/14.
 */

'use strict';

describe('bham.breadcrumbsModule module', function(){
    var module;

    beforeEach(function() {
        module = angular.module("bham.breadcrumbsModule");
    });

    it("should be registered", function() {
        expect(module).not.toEqual(null);
    });
});


describe('bham.breadcrumbsModule module', function () {

    var LocationMock = function (initialPath) {
        var pathStr = initialPath || '';
        this.path = function (pathArg) {
            return pathArg ? pathStr = pathArg : pathStr;
        };
    };

    var $location, $rootScope, breadcrumbs;

    beforeEach(module('bham.breadcrumbsModule'));

    beforeEach(inject(function($injector) {
        breadcrumbs = $injector.get('BreadcrumbsService');
        $rootScope = $injector.get('$rootScope');
        $location = $injector.get('$location');
        spyOn($location, 'path').andCallFake(new LocationMock().path);
    }));

    it('should have sensible defaults before route navigation', function() {
        expect(breadcrumbs.getAll()).toEqual([]);
        expect(breadcrumbs.getFirst()).toEqual({});
    });

    it('should not expose breadcrumbs before route change success', function () {
        $location.path('/some/path');
        expect(breadcrumbs.getAll()).toEqual([]);
        expect(breadcrumbs.getFirst()).toEqual({});
    });

    it('should correctly parse $location() after route change success', function () {
        $location.path('/some/path');
        $rootScope.$broadcast('$routeChangeSuccess', {});
        expect(breadcrumbs.getAll()).toEqual([
            { name:'some', path:'/some' },
            { name:'path', path:'/some/path' }
        ]);
        expect(breadcrumbs.getFirst()).toEqual({name:'some', path:'/some'});
    });

});


