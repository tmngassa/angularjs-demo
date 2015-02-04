/**
 * Created by tomson.ngassa on 3/3/14.
 */

'use strict';

describe('bham.patientDirectives module', function(){
    var module;

    beforeEach(function() {
        module = angular.module("bham.patientDirectives");
    });

    it("should be registered", function() {
        expect(module).not.toEqual(null);
    });
});

describe('bham.patientDirectives module showPatient', function(){
    var element;
    var scope;
    var compile;
    var patient;

    beforeEach(function() {
        angular.module("bham.patientDirectives");
    });

    beforeEach(inject(function($compile, $rootScope) {
        var html = ' <show-patient patient="patient"  ></show-patient>';
        patient = {firstName: "Tomson",id: 204,lastName: "Ngassa"};
        //create a scope
        scope = $rootScope.$new();
        //get the jqLite or jQuery element
        element = angular.element(html);
        //compile the element into a function to process the view.
        compile = $compile(element);
        //run the compiled view.
        //scope.patient =
        compile(scope);

        scope.$digest();
    }));

    it("should have get the patient to be shown", function() {

    });

    it('should show the patient details', function(){

    });

});
