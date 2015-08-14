angular.module('poliviz.committeeController', [])
.controller('committeeController', function($scope, committeeData){
  $scope.getData = function() {
    committeeData.getData()
      .then(function(data){
       $scope.data = data;
       console.log(data);
    })
  }
  $scope.getData();
})

.directive("myChart", function($window) {
  return{
    restrict: "EA",
    template: "<svg width='850' height='200'></svg>",
    link: function(scope, elem, attrs){
      // remove any previous charts
      d3.selectAll('svg').remove();
      scope.$watch('data', function(){
        var data = scope.data;
        //sort data, largest to smallest contributions
        data.sort(function(a,b){
          return b["SUM(TRANSACTION_AMT)"] - a["SUM(TRANSACTION_AMT)"]
        })
        var height = 1200;
        var width = window.innerWidth;
        //varibles to move datapoint to new line
        var yCounter = 40;
        var xCounter = 1;
        var rowSize = 25;
        var largestContribution = 1365616;
        var svg = d3.select("my-chart").append("svg")
            .attr("width", width)
            .attr("height", height);


        svg.selectAll('circle')
          .data(data)
          .enter()
          .append('circle')
          .style('fill', 'red')
          .attr('r', function(d){return Math.abs(d["SUM(TRANSACTION_AMT)"] / largestContribution * 50); })
          .attr('cy', function(d, i){
            if (i % rowSize === 0) {
              yCounter = yCounter + 40
            }
            return yCounter
          })
          .attr('cx', function(d, i){
            if (i %rowSize === 0) {
              xCounter = 1
            }
            xCounter++;
            return xCounter * 40
          })
      })
    }
  };
});