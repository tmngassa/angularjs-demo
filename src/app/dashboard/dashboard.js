'use strict';

angular.module("bham.dashboarModule", [])

.config(['$routeProvider', function($routeProvider) {    

		$routeProvider
		.when('/dashboard', {				
				template: "<h3>Dashboard</h3>"
			});
}]);