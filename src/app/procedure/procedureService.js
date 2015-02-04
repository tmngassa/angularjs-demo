'use strict';

angular.module('bham.procedureService', ['ngResource'])
    .constant('PROCEDURE_URL', 'http://bhamdevtest001:8087/bham/procedureobservations/patient/:patientId')
    .constant('PROCEDURE_ONLY_URL', 'http://bhamdevtest001:8087/bham/procedureobservations/:id')
    .constant('PROCEDURE_CODE_URL', 'http://bhamdevtest001:8087/bham/proceduretypecodes')
    .constant('PROCEDURE_STATUS_CODE_URL', 'http://bhamdevtest001:8087/bham/actstatuscodes')

    .factory('ProcedureService', ['$resource', 'PROCEDURE_URL', 'PROCEDURE_CODE_URL', 'PROCEDURE_STATUS_CODE_URL', 'PROCEDURE_ONLY_URL', '$location',
        function ($resource, PROCEDURE_URL, PROCEDURE_CODE_URL, PROCEDURE_STATUS_CODE_URL, PROCEDURE_ONLY_URL, $location) {

            var ProcedureResource = $resource(PROCEDURE_URL, {patientId: '@patientId'}, {'update': { method: 'PUT' }});
            var ProcedureOnlyResource = $resource(PROCEDURE_ONLY_URL, {id: '@id'}, {'update': {method: 'PUT'}});
            var ProcedureCodeResource = $resource(PROCEDURE_CODE_URL);
            var ProcedureStatusCodeResource = $resource(PROCEDURE_STATUS_CODE_URL);

            return {

                query: function (patientId, successCb, errorCb) {
                    ProcedureResource.query({patientId: patientId}, successCb, errorCb);
                },

                create: function (patientId, procedure, successCb, errorCb) {
                    ProcedureResource.save({patientId: patientId}, procedure, successCb, errorCb);
                },

                get: function (patientId, successCb, errorCb) {
                    return ProcedureResource.get({patientId: patientId}, successCb, errorCb);
                },

                update: function (id, procedure, successCb, errorCb) {
                    ProcedureOnlyResource.update({id: id}, procedure, successCb, errorCb);
                },

                delete: function (id, successCb, errorCb) {
                    ProcedureOnlyResource.delete({id: id}, successCb, errorCb);
                },

                getProcedureCodes: function (successCb, errorCb) {
                    ProcedureCodeResource.query(successCb, errorCb);
                },

                getProcedureStatusCodes: function (successCb, errorCb) {
                    ProcedureStatusCodeResource.query(successCb, errorCb);
                },

                getProcedureCodeResource: function(){
                    return ProcedureCodeResource;
                },

                getProcedureStatusCodeResource: function(){
                    return ProcedureStatusCodeResource;
                },

                getProcedureResource: function(){
                    return ProcedureResource;
                },

                getProcedureOnlyResource: function(){
                    return ProcedureOnlyResource;
                }

            };

        }]);