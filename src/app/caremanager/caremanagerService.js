'use strict';

angular.module('bham.caremanagerService', ['ngResource'])
    .constant('CARE_MANAGER_RESOURCE_URL', 'http://bhamdevtest001:8087/bham/individualproviders/:id' )
    .constant('CARE_MANAGER_STATE_RESOURCE_URL', 'http://bhamdevtest001:8087/bham/statecodes' )
    .constant('CARE_MANAGER_PROVIDER_TAXONOMY_RESOURCE_URL', 'http://bhamdevtest001:8087/bham/providertaxonomycodes' )

    .factory('CareManagerService', ['$resource','CARE_MANAGER_RESOURCE_URL', 'CARE_MANAGER_STATE_RESOURCE_URL', 'CARE_MANAGER_PROVIDER_TAXONOMY_RESOURCE_URL','$location',
        function($resource, CARE_MANAGER_RESOURCE_URL, CARE_MANAGER_STATE_RESOURCE_URL, CARE_MANAGER_PROVIDER_TAXONOMY_RESOURCE_URL, $location){

            var CareManagerResource = $resource( CARE_MANAGER_RESOURCE_URL,{id: '@id'},{'update': { method:'PUT' }} );

            var CareManagerStateResource = $resource( CARE_MANAGER_STATE_RESOURCE_URL);

            var CareManagerProviderTaxonomyResource = $resource( CARE_MANAGER_PROVIDER_TAXONOMY_RESOURCE_URL);

            return {

                query: function(successCb, errorCb) {
                    CareManagerResource.query(successCb, errorCb );
                },

                get : function(id, successCb, errorCb) {
                    return CareManagerResource.get({id:id}, successCb, errorCb);
                },

                update : function(id, caremanager, successCb, errorCb) {
                    CareManagerResource.update({id:id},caremanager,successCb, errorCb );
                },

                getStateResource: function(successCb, errorCb) {
                    return CareManagerStateResource;
                },

                getProviderTaxonomyResource: function() {
                    return CareManagerProviderTaxonomyResource;
                },

                getCareManagerResource : function(){
                    return CareManagerResource;
                }
            };

        }]);