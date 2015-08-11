angular.module('poliviz.committeeController', [])
.controller('committeeController', function($scope, dataSets){


})

.directive("myChart", function($window) {
  return{
    restrict: "EA",
    template: "<svg width='850' height='200'></svg>",
    link: function(scope, elem, attrs){
    }
  };
});