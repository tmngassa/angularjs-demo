angular.module("bham.reportsModule", [])

.config(['$routeProvider', function($routeProvider) {    
		'use strict';
		
		$routeProvider			
		.when('/reports', {				
				template: "<h3>Reports</h3>"
			});
}]);