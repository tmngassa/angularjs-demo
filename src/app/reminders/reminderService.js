/**
 * Created by tomson.ngassa on 4/22/14.
 */

'use strict';

angular.module('bham.reminderService', ['ngResource'])
    .constant('REMINDER_RESOURCE_URL', 'http://bhamdevtest001:8087/bham/reminders' )

    .factory('ReminderService', ['$resource','REMINDER_RESOURCE_URL',
        function($resource, REMINDER_RESOURCE_URL, $location){

            var reminderResource = $resource( REMINDER_RESOURCE_URL,{id: '@id'},{'update': { method:'PUT' }} );

            var reminders = [
                    {"id":0, "date":"04/12/2014", "from":"BHAM", "subject":"Illicit Drug use Screening", "patient":"Joe Bloggs", "messageType":"USPSTF Screening", "priority":"2", "status":"Accepted"},
                    {"id":1, "date":"04/25/2014", "from":"BHAM", "subject":"Depression Screening", "patient":"Linda Collins", "messageType":"USPSTF Screening", "priority":"1", "status":"Accepted"}
            ];

            return {

                query : function() {
                    return reminders;
                },

                get: function(id){
                    for (var i = 0; i < reminders.length; i++) {
                        if (reminders[i].id === parseInt(id)) {
                            return reminders[i];
                        }
                    }
                }
            };
        }]);