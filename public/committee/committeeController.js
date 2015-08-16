angular.module('poliviz.committeeController', [])
.controller('committeeController', function($scope, committeeData, indCandidateData){
  $scope.getData = function() {
    committeeData.getData()
      .then(function(data){
       $scope.data = data;
       console.log(data);
    });
  };

  //gets data for an individual candidate (post request)
  //callback required, data request takes too long, prevents d3 form manipulating on 0 data, causes error.
  $scope.indCandidateData = function (candName, callback) {
    indCandidateData.getData(candName)
      .then(function(data){
        $scope.indCandidate = data;
        callback(data);
      });
  };

  //Sets the default select/option to the first one (ALL)
  $scope.partyAffil = 'ALL';
  //filters the data based on party affiliation
  $scope.selectAffiliation = function () {
    committeeData.getData()
      .then(function(data){
        if ($scope.partyAffil === "ALL") {
          return $scope.data = data
        } else {
          $scope.data = data.filter(function(d){
            return d.CAND_PTY_AFFILIATION === $scope.partyAffil;
          });
        }
      })
  };

  $scope.getData();
})

.directive("myChart", function($window) {
  return{
    restrict: "EA",
    template: "<svg width='850' height='200'></svg>",
    link: function(scope, elem, attrs){
      scope.$watchGroup(['data', 'indCandidateData'], function(){
        // remove any previous charts
        d3.selectAll('svg').remove();
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
          })
          .on('click', function(d) {
          //makes a post request to server and db to find contributions by committee for the candidate 
            var selectedCandidate = d.CAND_NAME;
            scope.indCandidateData(selectedCandidate, function(data) {
              var radius = width / 3
              var color = d3.scale.ordinal()
                .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

              var arc = d3.svg.arc()
                  .outerRadius(radius - 10)
                  .innerRadius(0);

              var pie = d3.layout.pie()
                  .sort(null)
                  .value(function(d) { return d.TRANSACTION_AMT;});

              var svg = d3.select("svg").append("svg")
                  .append("g")
                  .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
              
              var g = svg.selectAll(".arc")
                  .data(pie(scope.indCandidate))
                  .enter().append("g")
                  .attr("class", "arc");

              g.append("path")
                  .attr("d", arc)
                  .style("fill", function(d) { return color(d.data.CMTE_NM); });

              // g.append("text")
              //     .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
              //     .attr("dy", ".35em")
              //     .style("text-anchor", "middle")
              //     .text(function(d) { return d.data.CMTE_NM; });

              //removes the rows of circles of all candidates
              
            });
            d3.selectAll('circle')
            .transition().duration(1000)
            .style('opacity', 0)
            .remove()

          })
      })
    }
  };
});