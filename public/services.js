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
	}
});