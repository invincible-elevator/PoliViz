angular.module('poliviz.services', [])

// Get data from all contributors
.factory('dataRetrieval', function($http){

	var contributorsData;
	var candidateData;
	
	return { 

		// This only happens once
		getCandidates: function(){ 
			return $http ({ 
				method: 'GET', 
				url: '/candidates'
			}).then(function(resp){
				candidateData = resp.data; 
				return resp.data;
			})
		},

		getCandidate: function(candidate){ 
			return $http ({ 
				method: 'GET', 
				url: '/candidates/' + candidate
			}).then(function(resp){ 
				return resp.data;
			})
		},
			
		// This only happens once
		getContributors: function(){ 
			return $http ({ 
				method: 'GET', 
				url: '/contributors'
			}).then(function(resp){ 
				contributorsData = resp.data;
				return resp.data;
			})
		},

		getContributor: function(contributor){ 
			return $http ({ 
				method: 'GET', 
				url: '/contributors/' + contributor
			}).then(function(resp){ 
				return resp.data;
			})
		},

		candidate: function(name) {
			if (!candidateData) return;

			for (var i = 0; i < candidateData.length; i++) {
				if (candidateData[i].name === name) {
					return candidateData[i].id;
				}
			}
		},

		contributor: function(name) {
			if (!contributorsData) return;

			for (var i = 0; i < contributorsData.length; i++) {
				if (contributorsData[i].name === name) {
					return contributorsData[i].id;
				}
			}
		},

		getCandidateData: function() {
			return candidateData;
		},

		getContributorData: function() {
			return contributorsData;
		}
	};
})

.factory('statePositions', function($scope) {

	var stateHash = {};

	return stateHash;
});