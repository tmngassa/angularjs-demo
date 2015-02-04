/**
 * Created by tomson.ngassa on 4/29/14.
 */

/**
 * Created by tomson.ngassa on 3/3/14.
 */

'use strict';

describe('bham.reminderService', function(){
    var module;

    beforeEach(function() {
        module = angular.module("bham.reminderService");
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
            dependencies = module.value('bham.reminderService').requires;
        });

        it("should have ngResource as a dependency", function() {
            expect(hasModule('ngResource')).toEqual(true);
        });
    });
});

describe('Reminder Resource', function(){
    var mockReminderService, $httpBackend, reminders;

    beforeEach(module('bham.reminderService'));

    beforeEach(function () {
        angular.mock.inject(function ($injector) {
            $httpBackend = $injector.get('$httpBackend');
            mockReminderService = $injector.get('ReminderService');

            var reminders = [
                {"id":0, "date":"04/12/2014", "from":"BHAM", "subject":"Illicit Drug use Screening", "patient":"Joe Bloggs", "messageType":"USPSTF Screening", "priority":"2", "status":"Accepted"},
                {"id":1, "date":"04/25/2014", "from":"BHAM", "subject":"Depression Screening", "patient":"Linda Collins", "messageType":"USPSTF Screening", "priority":"1", "status":"Accepted"}
            ];
        });
    });

    beforeEach(function(){
        this.addMatchers({
            toEqualData: function(expected) {
                return angular.equals(this.actual, expected);
            }
        });
    });

    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    xit('should get reminder by id', inject(function () {
        var reminder = {"id":0, "date":"04/12/2014", "from":"BHAM", "subject":"Illicit Drug use Screening", "patient":"Joe Bloggs", "messageType":"USPSTF Screening", "priority":"2", "status":"Accepted"};
        $httpBackend.expectGET("http://bhamdevtest001:8087/bham/reminders").respond(reminder);
        var result = mockReminderService.get(0);
        $httpBackend.flush();
        expect(result).toEqualData(reminder);
    }));

    xit('should get list of reminders', inject(function () {

    }));

});
