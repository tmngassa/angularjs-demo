
'use strict';

angular.module('bham.conditionService', ['ngResource'])
    .constant('CONDITION_RESOURCE_URL', 'http://bhamdevtest001:8087/bham/problems/patient/:patientId' )
    .constant('CONDITION_ONLY_URL', 'http://bhamdevtest001:8087/bham/problems/:id')
    .constant('PROBLEM_CODE_URL', 'http://bhamdevtest001:8087/bham/problemcodes')
    .constant('PROBLEM_STATUS_CODE_URL', 'http://bhamdevtest001:8087/bham/actstatuscodes')
    .constant('SMS_SERVICE_URL', 'http://bhamdevtest001:8087/decisionservice/sms')

    .factory('ConditionService', ['$resource','CONDITION_RESOURCE_URL','PROBLEM_CODE_URL', 'PROBLEM_STATUS_CODE_URL', 'CONDITION_ONLY_URL', 'SMS_SERVICE_URL', '$location',
        function($resource, CONDITION_RESOURCE_URL, PROBLEM_CODE_URL, PROBLEM_STATUS_CODE_URL, CONDITION_ONLY_URL, SMS_SERVICE_URL, $location){

            var ConditionResource = $resource(CONDITION_RESOURCE_URL, {patientId : '@patientId'}, {'update': { method:'PUT' }});
            var ConditionOnlyResource = $resource(CONDITION_ONLY_URL, {id : '@id'}, {'update': { method:'PUT' }});
            var ProblemCodeResource = $resource(PROBLEM_CODE_URL);
            var ProblemStatusCodeResource = $resource(PROBLEM_STATUS_CODE_URL);
            var SendSmsResource = $resource(SMS_SERVICE_URL);

            return {

                query: function(patientId, successCb, errorCb) {
                    ConditionResource.query({patientId : patientId}, successCb, errorCb);
                },

                create : function(patientId, condition, successCb, errorCb) {
                    ConditionResource.save({patientId : patientId}, condition, successCb, errorCb);
                },
                sendSms : function(patientId, condition, successCb, errorCb){
                    SendSmsResource.save({patientId : patientId}, condition, successCb, errorCb);
                },
                get : function(id, successCb, errorCb) {
                    ConditionOnlyResource.get({id : id}, successCb, errorCb);
                },

                update : function(id, condition, successCb, errorCb) {
                    ConditionOnlyResource.update({id : id}, condition, successCb, errorCb );
                },

                delete : function(id, successCb, errorCb) {
                    ConditionOnlyResource.delete({id : id}, successCb, errorCb);
                },

                getProblems: function(successCb, errorCb) {
                    ProblemCodeResource.query(successCb, errorCb);
                },

                getProblemStatusCodes : function(successCb, errorCb) {
                    ProblemStatusCodeResource.query(successCb, errorCb);
                },
                getConditionResource : function(){
                    return ConditionResource;
                },
                getProblemCodeResource : function(){
                    return ProblemCodeResource;
                },
                getProblemStatusCodeResource : function(){
                    return ProblemStatusCodeResource;
                },
                getConditionOnlyResource : function(){
                    return ConditionOnlyResource;
                },
                getSendSmsResource : function(){
                    return SendSmsResource;
                }
            };
        }]);