/**
 * Created by tomson.ngassa on 3/10/14.
 */

'use strict';

describe("bham.organizationModule:", function() {
    var $route, $location, $rootScope;

    beforeEach(module('ngRoute'));
    beforeEach(module('bham.organizationModule'));

    beforeEach(inject(function(_$route_, _$location_, _$rootScope_){
        $route = _$route_;
        $location = _$location_;
        $rootScope = _$rootScope_;
    }));

    it('should route to the organization page', function(){
        expect($route.current).toBeUndefined();
        $location.path('/organization');
        $rootScope.$digest();

        expect($location.path()).toBe('/organization');
        expect($route.current.template).toBe('<h3>Organization</h3>');
    });
});