angular.module('poliviz.homepageController', [])

.controller('homepageController', function($scope, dataSets) {
  $scope.data = [];

  $scope.getPolitician = function(){
    console.log($scope.firstName + ' ' +$scope.lastName);
  };

  $scope.getData = function() {
    dataSets.getdataSets('test')
      .then(function(data) {
        $scope.data = data;
        console.log(data);
      });
  };

  // $scope.getData();
})

.directive("bubbleChart", function($window) {
  return {
    restrict: "E",
    link: function(scope, elem, attrs) {

      var d3 = $window.d3;
      var dataset = {
        rulingMap: {
          "true": 10,
          "mostly-true": 6,
          "false": 20,
          "pants-fire": 5,
          "no-flip": 5,
          "half-flip": 1,
          "barely-true": 6,
          "full-flop": 2,
          "half-true": 8
        },
        pantsFireQuotes: ['PANTS ON FIRE!']
      };

      // D3 Bubble Chart 

      var diameter = 500;

      var processData = function(data) {
        var obj = data.rulingMap;

        var newDataSet = [];

        for (var prop in obj) {
          newDataSet.push({
            ruling: prop,
            className: prop.toLowerCase(),
            size: obj[prop]
          });
        }
        return {
          children: newDataSet
        };
      };

      var data = processData(dataset);

      var svg = d3.select('bubble-chart').append('svg')
        .attr('width', diameter)
        .attr('height', diameter);

      var gnodes = svg.selectAll('g')
        .data(data.children)
        .enter()
        .append('g')
        .classed('gnode', true);

      var bubble = d3.layout.pack()
        .size([diameter, diameter])
        .value(function(d) {
          return d.size;
        })
        .sort(function(a, b) {
          return -(a.value - b.value)
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
          return d.className;
        })
        .attr("stroke", "black")
        .attr("stroke-width", 1);

      gnodes.attr("transform", function(d) {
          return 'translate(' + [Math.random() * diameter, Math.random() * diameter] + ')';
        })
        .transition()
        .duration(800)
        .attr("transform", function(d) {
          return 'translate(' + [d.x, d.y] + ')';
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

    }
  };
});
