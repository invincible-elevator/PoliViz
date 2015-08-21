angular.module('poliviz', [
	'ui.router',
	'ui.bootstrap',
	'poliviz.committeeController',
	'poliviz.homepageController',
	'poliviz.services',
	'ngSanitize',
	'autocomplete'
])

.config(function($urlRouterProvider, $stateProvider){
	$urlRouterProvider.otherwise("/");

	$stateProvider
		.state('homepage',{
			url: '/',
			templateUrl: './homepage/homepageTemplate.html',
			controller: 'homepageController'
		})
		.state('committee', {
			url: '/committee',
			templateUrl: './committee/committeeTemplate.html',
			controller: 'committeeController'
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