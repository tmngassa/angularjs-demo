/**
 * Created by tomson.ngassa on 3/10/14.
 */

'use strict';

xdescribe("bham.toolsandresourcesModule:", function() {
    var $route, $location, $rootScope;

    beforeEach(module('ngRoute'));
    beforeEach(module('bham.toolsandresourcesModule'));

    beforeEach(inject(function(_$route_, _$location_, _$rootScope_){
        $route = _$route_;
        $location = _$location_;
        $rootScope = _$rootScope_;
    }));

    it('should route to the tools and resources page', function(){
        expect($route.current).toBeUndefined();
        $location.path('/toolsandresources');
        $rootScope.$digest();

        expect($location.path()).toBe('/toolsandresources');
        expect($route.current.template).toBe('<h3>Tools and Resources</h3>');
    });
});