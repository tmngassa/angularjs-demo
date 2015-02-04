/**
 * Created by tomson.ngassa on 3/10/14.
 */

'use strict';

describe("bham.visualanalyticsModule:", function() {
    var $route, $location, $rootScope;

    beforeEach(module('ngRoute'));
    beforeEach(module('bham.visualanalyticsModule'));

    beforeEach(inject(function(_$route_, _$location_, _$rootScope_){
        $route = _$route_;
        $location = _$location_;
        $rootScope = _$rootScope_;
    }));

    it('should route to the visual analytics page', function(){
        expect($route.current).toBeUndefined();
        $location.path('/visualanalytics');
        $rootScope.$digest();

        expect($location.path()).toBe('/visualanalytics');
        expect($route.current.template).toBe('<h3>Visual Analytics</h3>');
    });

});