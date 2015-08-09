angular.module('app', [
	'ui.router',
	'ngRoute',
	'ui.bootstrap',
	'poliviz.committeeController',
	'poliviz.homepageController', 
	'poliviz.services'
])

.config(function($urlRouterProvider, $stateProvider, $httpProvider){
	$urlRouterProvider.otherwise("/homepage");

	$stateProvider
		.state('homepage',{
			url: '/homepage',
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
	$scope.getPolitician = function(){
		console.log($scope.search);
	};
});