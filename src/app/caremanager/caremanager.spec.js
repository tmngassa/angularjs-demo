///**
// * Created by tomson.ngassa on 3/10/14.
// */
//
//'use strict';
//
//describe("bham.caremanagerModule:", function() {
//    var $route, $location, $rootScope;
//
//    beforeEach(module('ngRoute'));
//    beforeEach(module('bham.caremanagerModule'));
//
//    beforeEach(inject(function(_$route_, _$location_, _$rootScope_){
//        $route = _$route_;
//        $location = _$location_;
//        $rootScope = _$rootScope_;
//    }));
//
//    it('should route to the dashboard page', function(){
//        expect($route.current).toBeUndefined();
//        $location.path('/caremanager');
//        $rootScope.$digest();
//
//        expect($location.path()).toBe('/caremanager');
//        expect($route.current.template).toBe('<h3>Care manager</h3>');
//    });
//});