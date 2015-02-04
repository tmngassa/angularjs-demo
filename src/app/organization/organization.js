angular.module("bham.organizationModule", [])

.config(['$routeProvider', function($routeProvider) {    
		'use strict';
		
		$routeProvider			
		.when('/organization', {
				template: "<h3>Organization</h3>"
			});
}]);