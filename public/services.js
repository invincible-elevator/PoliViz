angular.module('poliviz.services', [])

.factory('Politicians', function($http){ 
	return { 
		getPoliticianData: function(name){ 
			return $http({ 
				method: 'GET',
				url: '/politician/' + name
			}).then(function(resp){ 
				return resp.data;
			});
		}
	}
})

.factory('dataSets', function($http){ 
	return { 
		getdataSets: function(name){ 
			return $http ({ 
				method: 'GET', 
				url: '/dataSets/' + name
			}).then(function(resp){ 
				return resp.data;
			})
		}
	};
})

.factory('committeeData', function($http){ 
	return { 
		getData: function(){ 
			return $http ({ 
				method: 'GET', 
				url: '/campaignContributions'
			}).then(function(resp){ 
				return resp.data;
			})
		}
	};
})

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

// formate a name so that it starts with capitals and has first name first
.factory('formating', function() {
	return {
		name: function(name) {

			if (!name) return '';

			var comma = name.indexOf(',');
			if (comma === -1) comma = -2;
			
			var first = name.slice(comma + 2).toLowerCase();
			var last = (comma === -2) ? '' : name.slice(0, comma).toLowerCase();

			var words = (first + ' ' + (last || '')).split(' ');
			var result = words.reduce(function(total, curr) {
				if (curr.length === 1) {
					curr = curr + '.';
				}
				return total + ' ' + curr.charAt(0).toUpperCase() + curr.slice(1);
			}, '');

			return result;
		},
	};
});