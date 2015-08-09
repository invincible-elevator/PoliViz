angular.module('poliviz.homepageController',[])

.controller('homepageController', function($scope, dataSets){
	$scope.data = [];

	$scope.getData = function(){  
      dataSets.getdataSets('test')
      .then(function(data){
      	$scope.data = data;
      	console.log(data);
      });
	};

	$scope.getData();
})


.directive("myChart", function($window) {
  return{
    restrict: "EA",
    template: "<svg width='850' height='200'></svg>",
    link: function(scope, elem, attrs){
    }
  };
});

