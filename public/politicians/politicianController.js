angular.module('poliviz.politicianController',[])

.controller('politicianController', function($scope, politicians){

})


.directive("myChart", function($window) {
  return{
    restrict: "EA",
    template: "<svg width='850' height='200'></svg>",
    link: function(scope, elem, attrs){
    }
  };
});