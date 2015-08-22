angular.module('poliviz', [
	'ui.router',
	'ui.bootstrap',
	'poliviz.committeeController',
	'poliviz.services',
	'ngSanitize',
	'autocomplete'
])

.config(function($urlRouterProvider, $stateProvider){
	$urlRouterProvider.otherwise("/committee");

	$stateProvider
		.state('committee', {
			url: '/committee',
			templateUrl: './committee/committeeTemplate.html',
			controller: 'committeeController'
		})
		.state('homepage',{
			url: '/factcheck',
			templateUrl: './homepage/homepageTemplate.html',
			controller: 'homepageController'
		});

})

.controller('AppController', function($scope){

})

.directive('navBar', function(){
	return {
		restrict: 'E',
		// controller: 'AppController',
		templateUrl: '/navbar/navbar.html'
	};
});