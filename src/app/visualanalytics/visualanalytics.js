angular.module("bham.visualanalyticsModule", [])

.config(['$routeProvider', function($routeProvider) {    
		'use strict';
		
		$routeProvider			
		.when('/visualanalytics', {				
				template: "<h3>Visual Analytics</h3>"
			});
}]);