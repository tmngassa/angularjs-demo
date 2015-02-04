angular.module("bham.messagecenterModule", [])

.config(['$routeProvider', function($routeProvider) {    
		'use strict';
		
		$routeProvider			
		.when('/messagecenter', {				
				template: "<h3>Message Center</h3>"
			});
}]);