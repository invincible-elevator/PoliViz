angular.module('poliviz.homepageController', [])

.controller('homepageController', function($scope, dataSets) {
  $scope.data = [];
  $scope.name = '';

  $scope.getPolitician = function() {
    var name = $scope.firstName + '_' + $scope.lastName;
    dataSets.getdataSets(name)
      .then(function(data) {
        $scope.data = data[0].data;
        $scope.name = data[0].name.split('_').join(' ');
        console.log($scope.data);
      });
  };

  // $scope.getData = function() {
  //   dataSets.getdataSets('test')
  //     .then(function(data) {
  //       $scope.data = data;
  //       console.log(data);
  //     });
  // };

  // $scope.getData();
})

.directive("bubbleChart", function($window) {
  return {
    restrict: "E",
    link: function(scope, elem, attrs) {
      //This gets called when data changes.
      scope.$watch("name", function() {
  
        var d3 = $window.d3;
        var dataset = scope.data.rulingMap;
        console.log(dataset);

        // D3 Bubble Chart 

        var height = 500;
        var width = 650;

        var processData = function(data) {
          for(var i = 0; i < data.length; i++) {
            if(data[i].value === 0) {
              data.splice(i, 1);
              i--;
            }
          }

          return {
            children: data
          };
        };

        var data = processData(dataset);

        d3.selectAll('svg').remove();

        var svg = d3.select('bubble-chart').append('svg')
          .attr('width', width)
          .attr('height', height);

        var gnodes = svg.selectAll('g')
          .data(data.children)
          .enter()
          .append('g')
          .classed('gnode', true);

        var bubble = d3.layout.pack()
          .size([width, height])
          .value(function(d) {
            return d.value;
          })
          .sort(function(a, b) {
            return -(a.value - b.value);
          })
          .padding(3);

        // generate data with calculated layout values
        var nodes = bubble.nodes(data)
          .filter(function(d) {
            return !d.children;
          }); // filter out the outer bubble

        var vis = gnodes.selectAll('circle')
          .data(nodes, function(d) {
            return d.ruling;
          });

        gnodes.append('circle')
          .attr('r', function(d) {
            return d.r;
          })
          .attr('class', function(d) {
            return d.ruling;
          })
          .attr("stroke", "black")
          .attr("stroke-width", 1);

        gnodes.attr("transform", function(d) {
            return 'translate(' + [Math.random() * width, Math.random() * height] + ')';
          })
          .transition()
          .duration(800)
          .attr("transform", function(d) {
            return 'translate(' + [d.x+50, d.y] + ')';
          });


        var labels = gnodes.append('text')
          .attr("dy", ".3em")
          .style("text-anchor", "middle")
          .text(function(d) {
            return d.ruling;
          });

        gnodes.on("mouseover", function() {
            d3.select(this).select('circle').transition().duration(500).attr('r', function(d) {
              return d.r * 1.2;
            });
            d3.select(this).select('text').transition().duration(1000).attr('font-size', '1.5em');
          })
          .on('mouseout', function() {
            d3.select(this).select('circle').transition().duration(300).attr('r', function(d) {
              return d.r;
            });
            d3.select(this).select('text').transition().duration(1000).attr('font-size', '1em');
          });
      });
    }
  };
});