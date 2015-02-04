
'use strict';

angular.module('bham.patientService', ['ngResource'])
    .constant('PATIENT_RESOURCE_URL', 'http://bhamdevtest001:8087/bham/patients/:id' )
    .constant('PATIENT_STATE_RESOURCE_URL', 'http://bhamdevtest001:8087/bham/statecodes' )
    .constant('PATIENT_RACE_RESOURCE_URL', 'http://bhamdevtest001:8087/bham/racecodes' )
    .constant('PATIENT_WEKA_RESOURCE_URL', 'http://bhamdevtest001:8087/decisionservice/:problemCode/:problemCodeSystem/:age/:race/:genderCode/:socialHistoryCode/:zipCode' )

    .factory('PatientService', ['$resource','PATIENT_RESOURCE_URL', 'PATIENT_STATE_RESOURCE_URL','PATIENT_RACE_RESOURCE_URL','PATIENT_WEKA_RESOURCE_URL','$location',
                                function($resource, PATIENT_RESOURCE_URL, PATIENT_STATE_RESOURCE_URL, PATIENT_RACE_RESOURCE_URL, PATIENT_WEKA_RESOURCE_URL, $location){


    var PatientResource = $resource( PATIENT_RESOURCE_URL,{id: '@id'},{'update': { method:'PUT' }} );

    var PatientStateResource = $resource( PATIENT_STATE_RESOURCE_URL);

    var PatientRaceResource = $resource( PATIENT_RACE_RESOURCE_URL);

    var PatientWekaResource = $resource( PATIENT_WEKA_RESOURCE_URL,
                                        {problemCode: '@problemCode',
                                         problemCodeSystem: '@problemCodeSystem',
                                         age: '@age',
                                         race: '@race',
                                         genderCode: '@genderCode',
                                         socialHistoryCode: '@socialHistoryCode',
                                         zipCode: '@zipCode'
                                        }
                               );

    return {

        create : function(patient, successCb, errorCb) {
            PatientResource.save( patient, successCb, errorCb);
        },

        get : function(id, successCb, errorCb) {
            return PatientResource.get({id:id}, successCb, errorCb);
        },

        update : function(id, patient, successCb, errorCb) {
            PatientResource.update({id:id},patient,successCb, errorCb );
        },

        delete : function(id, successCb, errorCb) {
            return PatientResource.delete({id:id}, successCb, errorCb);
        },

        getPatientResource : function(){
            return PatientResource;
        },

        getStateResource : function(){
            return PatientStateResource;
        },
        getRaceResource : function(){
            return PatientRaceResource;
        },

        queryWeka: function(wekaObject, successCb, errorCb){
            PatientWekaResource.get(wekaObject, successCb, errorCb );
        }
    };

}]);