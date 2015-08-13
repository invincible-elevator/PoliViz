angular.module('poliviz.homepageController', [])

.controller('homepageController', function($scope, dataSets) {
  $scope.data = [];
  $scope.reveal = false;
  $scope.quotes = [];
  $scope.ruling = '';

  // helper function to return data from API/database
  $scope.getPolitician = function() {
    var name = $scope.firstName + '_' + $scope.lastName;

    // hide quotes
    $scope.reveal = false;
    dataSets.getdataSets(name)
      .then(function(data) {
        if(data === 'Error') {

        }

        $scope.data = data;
        // $scope.name = data[0].name.split('_').join(' ');      
      });
  };

  $scope.rulingConvert = function(ruling) {
    if (ruling === 'true') {
      return 'True Statements';
    } else if (ruling === 'mostly-true') {
      return 'Mostly True Statements';
    } else if (ruling === 'false') {
      return 'False Statements';
    } else if (ruling === 'pants-fire') {
      return 'Liar Liar Pants on Fire Statements';
    } else if (ruling === 'no-flip') {
      return 'No Flip Positions/Statements';
    } else if (ruling === 'half-flip') {
      return 'Half Flip Positions/Statements';
    } else if (ruling === 'barely-true') {
      return 'Barely True Statements';
    } else if (ruling === 'full-flop') {
      return 'Full Flop Positions/Statements';
    } else if (ruling === 'half-true') {
      return 'Half True Statements';
    }
  };
})

.directive("bubbleChart", function($window) {
  return {
    restrict: "E",
    scope: false,
    link: function(scope, elem, attrs) {
      //This gets called when data changes.
      scope.$watch("data", function() {

        var d3 = $window.d3;
        var dataset = scope.data.rulingMap;

        // D3 Bubble Chart 

        var height = 600;
        var width = 700;

        // helper function to process data and remove any rulings with zero values
        var processData = function(data) {
          for (var i = 0; i < data.length; i++) {
            if (data[i].value === 0) {
              data.splice(i, 1);
              i--;
            }
          }

          return {
            children: data
          };
        };

        // process data from api get request
        var data = processData(dataset);

        // remove any previous charts
        d3.selectAll('svg').remove();

        // initiate svg
        var svg = d3.select('bubble-chart').append('svg')
          .attr('width', width)
          .attr('height', height);

        var tip = d3.tip()
          .attr('class', 'd3-tip')
          .offset([-10, 0])
          .html(function(d) {
            console.log(d);
            return "<h5>Quote Highlight</h5> <div class='miniQuote'>"+d.quotes[0]+"</div>";
          });

        // append gnodes to svg div
        var gnodes = svg.selectAll('g')
          .data(data.children)
          .enter()
          .append('g')
          .classed('gnode', true);

        gnodes.call(tip);
        // create layout
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

        // append bubbles to gnodes
        gnodes.append('circle')
          .attr('r', function(d) {
            return d.r;
          })
          .attr('class', function(d) {
            return d.ruling;
          })
          .attr("stroke", "black")
          .attr("stroke-width", 1);

        // initial animation starting at random location and ending at pack coordinates
        gnodes.attr("transform", function(d) {
            return 'translate(' + [Math.random() * width, Math.random() * height] + ')';
          })
          .transition()
          .duration(800)
          .attr("transform", function(d) {
            return 'translate(' + [d.x + 50, d.y] + ')';
          });

        // append bubble lables to gnodes
        var labels = gnodes.append('text')
          .attr("dy", ".3em")
          .style("text-anchor", "middle")
          .text(function(d) {
            return d.ruling;
          });

        // animation on mouse hover
        gnodes.on("mouseover", function(d) {
            d3
            d3.select(this).select('text').transition().duration(800).attr('font-size', '1.3em');
            d3.select(this).select('circle').transition().duration(800).attr('r', function(d) {
              return d.r * 1.2;
            })
              .style('opacity', 1);
            
          })
          .on('mouseout', function() {
            d3.select(this).select('text').transition().duration(800).attr('font-size', '1em');
            d3.select(this).select('circle').transition().duration(800).attr('r', function(d) {
              return d.r;
            })
              .style('opacity', 0.6);
          })
          .on('click', function(d) {
            scope.quotes = d.quotes;
            scope.ruling = scope.rulingConvert(d.ruling);
            scope.reveal = true;
            scope.$apply();
          });

        d3.selectAll('circle').on("mouseover", function(d) {
            tip.show(d)
              .style('opacity', 0.6);
          })
          .on('mouseout', function(d) {
            tip.hide(d);
          });
      });
    }
  };
});