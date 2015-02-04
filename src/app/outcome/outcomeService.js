'use strict';

angular.module('bham.outcomeService', ['ngResource'])
    .constant('OUTCOME_URL', 'http://bhamdevtest001:8087/bham/outcomes/patient/:patientId')
    .constant('OUTCOME_ONLY_URL', 'http://bhamdevtest001:8087/bham/outcomes/:id')
    .constant('CGI_I_CODE_URL', 'http://bhamdevtest001:8087/bham/cgiicodes')
    .constant('CGI_S_CODE_URL', 'http://bhamdevtest001:8087/bham/cgiscodes')
    .constant('PROCEDURE_CODE_URL', 'http://bhamdevtest001:8087/bham/proceduretypecodes')


    .factory('OutcomeService', ['$resource',
        'OUTCOME_URL',
        'OUTCOME_ONLY_URL',
        'CGI_I_CODE_URL',
        'CGI_S_CODE_URL',
        'PROCEDURE_CODE_URL',
        '$location',
        function ($resource, OUTCOME_URL, OUTCOME_ONLY_URL, CGI_I_CODE_URL, CGI_S_CODE_URL, PROCEDURE_CODE_URL, $location) {

            var OutcomeResource = $resource(OUTCOME_URL, {patientId: '@patientId'}, {'update': { method: 'PUT' }});
            var OutcomeOnlyResource = $resource(OUTCOME_ONLY_URL, {id: '@id'}, {'update': { method: 'PUT' }});
            var CgiICodeResource = $resource(CGI_I_CODE_URL);
            var CgiSCodeResource = $resource(CGI_S_CODE_URL);
            var ProcedureCodeResource = $resource(PROCEDURE_CODE_URL);

            return {

                query: function (patientId, successCb, errorCb) {
                    OutcomeResource.query({patientId: patientId}, successCb, errorCb);
                },

                create: function (patientId, outcome, successCb, errorCb) {
                    OutcomeResource.save({patientId: patientId}, outcome, successCb, errorCb);
                },

                get: function (id, successCb, errorCb) {
                    OutcomeOnlyResource.get({id: id}, successCb, errorCb);
                },

                update: function (id, outcome, successCb, errorCb) {
                    OutcomeOnlyResource.update({id: id}, outcome, successCb, errorCb);
                },

                delete: function (id, successCb, errorCb) {
                    OutcomeOnlyResource.delete({id: id}, successCb, errorCb);
                },

                getCgiICodeResource: function (successCb, errorCb) {
                    return CgiICodeResource;
                },

                getCgiSCodeResource: function (successCb, errorCb) {
                    return CgiSCodeResource;
                },

                getProcedureCodeResource: function (successCb, errorCb) {
                    console.log('inside the service...');
                    return ProcedureCodeResource;
                },

                getOutcomeResource: function () {
                    return OutcomeResource;
                },

                getOutcomeOnlyResource: function () {
                    return OutcomeOnlyResource;
                }

            };
        }]);