/**
 * Created by tomson.ngassa on 4/29/14.
 */

'use strict';

describe('bham.reminderModule', function(){
    var module;

    beforeEach(function() {
        module = angular.module("bham.reminderModule");
    });

    it("should be registered", function() {
        expect(module).not.toEqual(null);
    });

    describe("Dependencies:", function() {

        var dependencies;

        var hasModule = function(m) {
            return dependencies.indexOf(m) >= 0;
        };

        beforeEach(function() {
            dependencies = module.value('bham.reminderModule').requires;
        });

        it("should have ngResource as a dependency", function() {
            expect(hasModule('ngResource')).toEqual(true);
        });

        it("should have bham.reminderService as a dependency", function() {
            expect(hasModule('bham.reminderService')).toEqual(true);
        });

        it("should have bham.naturalSort as a dependency", function() {
            expect(hasModule('bham.naturalSort')).toEqual(true);
        });
    });
});

xdescribe("bham.reminderModule ReminderListCtrl", function() {

    beforeEach(module('ngRoute'));
    beforeEach(module('bham.reminderModule'));

    beforeEach(function(){
        this.addMatchers({
            toEqualData: function(expected) {
                return angular.equals(this.actual, expected);
            }
        });
    });

    var scope, ReminderService;

    beforeEach(inject(function($rootScope, $controller){
        scope = $rootScope.$new();
        var reminders = [
            {"id":0, "date":"04/12/2014", "from":"BHAM", "subject":"Illicit Drug use Screening", "patient":"Joe Bloggs", "messageType":"USPSTF Screening", "priority":"2", "status":"Accepted"},
            {"id":1, "date":"04/25/2014", "from":"BHAM", "subject":"Depression Screening", "patient":"Linda Collins", "messageType":"USPSTF Screening", "priority":"1", "status":"Accepted"}
        ];

        var successCb = function(){console.log('Success');};
        var errorCb =  function (){ console.log('Error');};

        ReminderService = {
            query: function(successCb, errorCb) {
                return reminders ;
            },
            get : function(id, successCb, errorCb) {
                for(var i = 0; i < reminders.length ; i++ ){
                    if(reminders[i].id === id){
                        return reminders[i];
                    }
                }
            }
        };

        scope.reminders = reminders;
        scope.filteredReminderss = reminders;
        scope.totalRecords = reminders.length;

        $controller('ReminderListCtrl', {
            $scope: scope,
            ReminderService: ReminderService,
            loadedReminders: reminders
        });
    }));

    xit('should initialize default values', function(){
        expect(scope.pageSize).toEqual(10);
        expect(scope.showPageSize).toEqual(10);
        expect(scope.startRecord).toEqual(1);

        expect(scope.sortField).toBeUndefined();
        expect(scope.reverse).toBeFalsy();

        expect(scope.pages).toEqualData([]);
        expect(scope.pageNo).toEqual(0);

        expect(scope.firstPage).toEqual(0);
        expect(scope.lastPage).toEqual(0);
    });

    xit('should sort by firstName column', function(){
        scope.sortField = 'firstName';
        scope.sort('firstName');
        expect(scope.reverse).toBeTruthy();
        scope.sort('firstName');
        expect(scope.reverse).toBeFalsy();

        scope.sort("");
        expect(scope.reverse).toBeFalsy();
        expect(scope.sortField).toEqual("");
    });

    xit('should sort in ascending order', function(){
        scope.sortField = 'firstName';
        expect(scope.isSortUp(scope.sortField)).toBeTruthy();
        scope.sort(scope.sortField);
        expect(scope.isSortUp(scope.sortField)).toBeFalsy();
    });

    xit('should sort in descending order', function(){
        scope.sortField = 'firstName';
        expect(scope.isSortDown(scope.sortField)).toBeFalsy();
        scope.sort(scope.sortField);
        expect(scope.isSortDown(scope.sortField)).toBeTruthy();
    });

    xit('should change showPageSize on page size change', function(){
        scope.pageSize = 20;
        scope.onPageSizeChange();
        expect(scope.showPageSize).toEqual(18);  // Since the list of patients is 4
        expect(scope.startRecord).toEqual(1);
        expect(scope.pageNo).toEqual(0);

        scope.pageSize = 2;
        scope.onPageSizeChange();
        expect(scope.showPageSize).toEqual(2);  // Since the list of patients is 4
        expect(scope.startRecord).toEqual(1);
        expect(scope.pageNo).toEqual(0);
    });

    xit('should delete the first patient', function(){
        expect(scope.patients.length).toEqual(18);
        scope.deletePatient(0);
        expect(scope.patients.length).toEqual(17);
//        expect(PatientService.delete).toHaveBeenCalled();
    });

    xit('should calculate pagination pages', function(){
        scope.pages = [];
        //Create 5 pages
        for (var i=0; i<5; i++) {
            scope.pages.push(i);
        }
        scope.setActivePage(2);
        expect(scope.pageNo).toEqual(2);
    });

    xit('should seach patient table', function(){
        expect(scope.pageNo).toEqual(0);
        scope.searchBy = 'administrativeGenderCodeDisplayName';
        scope.onSearch();
        expect(scope.composedCriteria).toEqual({administrativeGenderCodeDisplayName : "" + scope.criteria});

        scope.criteria = 'birthdate';
        scope.searchBy = 'addressPostalCode';
        scope.onSearch();
        expect(scope.composedCriteria).toEqual({addressPostalCode : scope.criteria});

        scope.criteria = 'birthdate';
        scope.searchBy = '';
        scope.onSearch();
        expect(scope.composedCriteria).toEqual( scope.criteria);
    });

    xit("should update the showpage variable when the filter patient length changes", function(){
        expect(scope.pages).toEqual([]);
        //In case the filter size is less than the page size
        scope.filteredPatients =[
            {firstName: "Tomson",id: 214,lastName: "Ngassa"},{ firstName: "Thomas",id: 205,lastName: "Ngassa"},
            {firstName: "Tommy",id: 206,lastName: "Ngassa"}, {firstName: "Tommy",id: 206,lastName: "Ngassa"}
        ];
        scope.$apply();
        expect(scope.startRecord ).toEqual(1);
        expect(scope.showPageSize ).toEqual(4);

        //In case the filter size is more than the page size
        scope.filteredPatients =[
            {firstName: "Tomson",id: 214,lastName: "Ngassa"},{ firstName: "Thomas",id: 205,lastName: "Ngassa"},
            {firstName: "Tommy",id: 206,lastName: "Ngassa"}, {firstName: "Tommy",id: 206,lastName: "Ngassa"},
            {firstName: "Tomson",id: 214,lastName: "Ngassa"},{ firstName: "Thomas",id: 205,lastName: "Ngassa"},
            {firstName: "Tommy",id: 206,lastName: "Ngassa"}, {firstName: "Tommy",id: 206,lastName: "Ngassa"},
            {firstName: "Tomson",id: 214,lastName: "Ngassa"},{ firstName: "Thomas",id: 205,lastName: "Ngassa"},
            {firstName: "Tommy",id: 206,lastName: "Ngassa"}, {firstName: "Tommy",id: 206,lastName: "Ngassa"}
        ];
        scope.$apply();
        expect(scope.startRecord ).toEqual(1);
        expect(scope.showPageSize ).toEqual(10);
    });

    xit("should update pagination pages when page size changes", function(){
        //If page size is greater than total patients
        expect(scope.pageSize).toEqual(10);
        scope.pageSize = 25;
        scope.$apply();
        expect(scope.pages).toEqual([0]);

        //If page size is less than total patients
        scope.pageSize = 15;
        scope.$apply();
        expect(scope.pages).toEqual([0, 1]);

//        scope.totalRecords = 18,
//        scope.filteredPatients = undefined;
//        scope.$apply();
//        expect(scope.pages).toEqual([0, 1])
    });
});

