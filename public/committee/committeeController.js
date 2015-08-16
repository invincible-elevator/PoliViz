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
        var width = window.innerWidth-200;
        //varibles to move datapoint to new line
        var yCounter = 40;
        var xCounter = 1;
        var rowSize = 50;
        var largestContribution = 1365616;
        var svg = d3.select("my-chart").append("svg")
            .attr("width", width)
            .attr("height", height);

        var circles = svg.selectAll('circle')
          .data(data)
          .enter()
          .append('circle')
          .style('fill', function(d) {
            if(d["CAND_PTY_AFFILIATION"] === "REP") {
              return 'red';
            } else if(d["CAND_PTY_AFFILIATION"] === "DEM") {
              return 'blue';
            } else {
              return 'green';
            }
          })
          .attr('r', function(d){
            if(Math.abs(d["SUM(TRANSACTION_AMT)"] / largestContribution * 20) < 6) {
              return 6;
            } else {
              return Math.abs(d["SUM(TRANSACTION_AMT)"] / largestContribution * 20); 
            }
          })
          .attr('cx', function(){ return Math.random()*width; })
          .attr('cy', function(){ return Math.random()*height; })
          .transition().duration(1000)
          .attr('cy', function(d, i){
            if (i % rowSize === 0) {
              yCounter = yCounter + 40;
            }
            return yCounter
          })
          .attr('cx', function(d, i){
            if (i %rowSize === 0) {
              xCounter = 1
            }
            xCounter++;
            return xCounter * 20
          })

          var tip = d3.tip()
          .attr('class', 'd3-tip')
          .offset([-10, 0])
          .html(function(d) {
            console.log(d);
            return "<h5>"+d['CAND_NAME']+"</h5> <div class='miniQuote'> Total Raised: $" + d['SUM(TRANSACTION_AMT)'] + "</div>";
          });

          circles.call(tip);

          d3.selectAll('circle').on("mouseover", function(d) {
            tip.show(d)
              .style('opacity', 0.6);
          })
          .on('mouseout', function(d) {
            tip.hide(d);
          });
      })
    }
  };
});