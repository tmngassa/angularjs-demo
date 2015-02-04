'use strict';

angular.module('bham.socialhistoryService', ['ngResource'])
    .constant('SOCIALHISTORY_RESOURCE_URL', 'http://bhamdevtest001:8087/bham/socialhistorys/patient/:patientId' )
    .constant('SOCIALHISTORY_ONLY_URL', 'http://bhamdevtest001:8087/bham/socialhistorys/:id')
    .constant('SOCIALHISTORY_TYPE_URL', 'http://bhamdevtest001:8087/bham/socialhistorytypecodes')
    .constant('PROBLEM_STATUS_CODE_URL', 'http://bhamdevtest001:8087/bham/actstatuscodes')

    .factory('SocialhistoryService', ['$resource','SOCIALHISTORY_RESOURCE_URL', 'SOCIALHISTORY_ONLY_URL', 'SOCIALHISTORY_TYPE_URL', 'PROBLEM_STATUS_CODE_URL', '$location',
        function($resource, SOCIALHISTORY_RESOURCE_URL, SOCIALHISTORY_ONLY_URL, SOCIALHISTORY_TYPE_URL, PROBLEM_STATUS_CODE_URL, $location){

            var SocialHistoryResource = $resource(SOCIALHISTORY_RESOURCE_URL, {patientId : '@patientId'}, {'update': { method:'PUT' }});
            var SocialHistoryOnlyResource = $resource(SOCIALHISTORY_ONLY_URL, {id : '@id'}, {'update': { method:'PUT' }});
            var SocialHistoryTypeResource = $resource(SOCIALHISTORY_TYPE_URL);
            var ProblemStatusCodeResource = $resource(PROBLEM_STATUS_CODE_URL);

            return {

                query: function(patientId, successCb, errorCb) {
                    SocialHistoryResource.query({patientId : patientId}, successCb, errorCb);
                },

                create : function(patientId, SocialHistory, successCb, errorCb) {
                    SocialHistoryResource.save({patientId : patientId}, SocialHistory, successCb, errorCb);
                },

                get : function(id, successCb, errorCb) {
                    SocialHistoryOnlyResource.get({id : id}, successCb, errorCb);
                },

                update : function(id, SocialHistory, successCb, errorCb) {
                    SocialHistoryOnlyResource.update({id : id}, SocialHistory, successCb, errorCb );
                },

                delete : function(id, successCb, errorCb) {
                    SocialHistoryOnlyResource.delete({id : id}, successCb, errorCb);
                },

                getSocialHistoryTypeCodes: function(successCb, errorCb) {
                    SocialHistoryTypeResource.query(successCb, errorCb);
                },

                getProblemStatusCodes : function(successCb, errorCb) {
                    ProblemStatusCodeResource.query(successCb, errorCb);
                },

                getSocialHistoryResource: function() {
                    return SocialHistoryResource;
                },

                getSocialHistoryOnlyResource: function() {
                    return SocialHistoryOnlyResource;
                },

                getSocialHistoryTypeResource: function() {
                    return SocialHistoryTypeResource;
                },

                getProblemStatusCodeResource: function() {
                    return ProblemStatusCodeResource;
                }
            };

        }]);