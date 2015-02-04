/**
 * Created by tomson.ngassa on 3/10/14.
 */

'use strict';

describe("bham.messagecenterModule:", function() {
    var $route, $location, $rootScope;

    beforeEach(module('ngRoute'));
    beforeEach(module('bham.messagecenterModule'));

    beforeEach(inject(function(_$route_, _$location_, _$rootScope_){
        $route = _$route_;
        $location = _$location_;
        $rootScope = _$rootScope_;
    }));

    it('should route to the message center page', function(){
        expect($route.current).toBeUndefined();
        $location.path('/messagecenter');
        $rootScope.$digest();

        expect($location.path()).toBe('/messagecenter');
        expect($route.current.template).toBe('<h3>Message Center</h3>');
    });
});