angular.module('bham.breadcrumbsModule', [])

//Keep a key value pair of menu items to be shown in browser
.constant('menuItemsMap' ,{
			dashboard: 'Dashboard',
			caremanager: 'Care Manager',
            messagecenter: 'Message Center',
            organization: 'Organization Profile',
            patients: 'Patient List',
            visualanalytics: 'Visual analytics',
            reports: 'Reports',
            toolsandresources: 'Tools & Resources',
            error:'Error',
            treatmentplan: 'Treatment Plan Wizard',
            conditions: 'Conditions',
            socialhistories: 'Social History',
            patientprofile: 'Summary Care Record',
            demographics: 'Demographics',
            procedures: 'Procedures',
            patient: 'Patient',
            reminders: 'Reminders'
})

.factory('BreadcrumbsService', ['$rootScope', '$location', 'menuItemsMap', function($rootScope, $location, menuItemsMap){
  'use strict';

  var breadcrumbs = [];
  
  $rootScope.$on('$routeChangeSuccess', function(event, current){

    var pathElements = $location.path().split('/'), result = [], i;
    var pathElementsLength = pathElements.length;

     //Remove id at the end of the path
    if( pathElementsLength > 0) {
        var lastElement = pathElements[pathElementsLength - 1];
        if(! isNaN(lastElement)) {
            var pathElementsWithoutId = pathElements.slice(0 , pathElementsLength - 1);
            pathElements = pathElementsWithoutId;
        }
    }

    var breadcrumbPath = function (index) {
      return '/' + (pathElements.slice(0, index + 1)).join('/');
    };

    pathElements.shift();
    for (i=0; i<pathElements.length; i++) {
        //Get the name of the menu items that will be shown in the browser
        //if it exist or use the name in the path
        var menuName = menuItemsMap[ pathElements[i]] || pathElements[i] ;
        result.push({name: menuName , path: breadcrumbPath(i)});
    }

    breadcrumbs = result;
  });

   return {
       getAll : function(){
           return breadcrumbs;
       },

       getFirst: function(){
           return breadcrumbs[0] || {};
       }
   };
}]);