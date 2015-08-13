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
        if (data === 'Error') {

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

        var height = 500;
        var width = 700;

        // helper function to process data and remove any rulings with zero values
        var processData = function(data) {
          for (var i = 0; i < data.length; i++) {
            data[i].radius = data[i].value;
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
            return "<h5>Quote Highlight</h5> <div class='miniQuote'>" + d.quotes[0] + "</div>";
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
          .size([width+30, height+30])
          .value(function(d) {
            return d.value;
          })
          .sort(function(a, b) {
            return -(a.value - b.value);
          })
          .padding(20);

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
        circles = gnodes.append('circle')
          .attr("r", 0)
          .attr('class', function(d) {
            return d.ruling;
          })
          .attr("stroke", "black")
          .attr("stroke-width", 1);

        // transition animation for growing circles
        circles.transition().duration(800).attr('r', function(d) {
          return d.r;
        });

        // append bubble lables to gnodes

        var labels = gnodes.append('text')
          .attr("dy", ".3em")
          .style("text-anchor", "middle")
          .text(function(d) {
            return d.ruling;
          });

        // force layout 
        var force;
        var layout_gravity = -0.119;
        var damper = 0.1;
        var center = {
          x: width / 2,
          y: height / 2
        };

        var charge = function(d) {
          return -Math.pow(d.radius, 2) % 8;
        };

        var start = function() {
          force = d3.layout.force()
            .nodes(data.children)
            .size([width, height]);
        };

        // animates towards the center and at the same time repelled by settings
        var display_group_all = function() {
          force.gravity(layout_gravity)
            .charge(charge)
            .friction(0.8)
            .on("tick", function(e) {
               gnodes.each(move_towards_center(e.alpha))
                     // collision detection in work
                     // .attr("transform", function(d) {return 'translate(' + [d.x, d.y] + ')';})
                     // .each(collide(.8))
                     .attr("transform", function(d) {return 'translate(' + [d.x, d.y] + ')';});
            });
          force.start();
        };

        // moves nodes towards center
        var move_towards_center = function(alpha) {
          return function(d) {
            d.x = d.x + (center.x - d.x) * (damper + 0.02) * alpha;
            d.y = d.y + (center.y - d.y) * (damper + 0.02) * alpha;
          };
        };

        // invoke force layout and move towards center - this is a very subtle animation

        start();
        display_group_all();

        //collision detection in work
        // function collide(alpha) {
        //   var quadtree = d3.geom.quadtree(nodes);
        //   return function(d) {
        //     console.log(d);
        //     var r = d.r,
        //         nx1 = d.x - r,
        //         nx2 = d.x + r,
        //         ny1 = d.y - r,
        //         ny2 = d.y + r;
        //     quadtree.visit(function(quad, x1, y1, x2, y2) {
        //       if (quad.point && (quad.point !== d)) {
        //         var x = (d.x - quad.point.x)*0.53,
        //             y = (d.y - quad.point.y)*0.85,
        //             l = Math.sqrt(x * x + y * y),
        //             r = d.r*1.1 + quad.point.radius;
        //         if (l < r) {
        //           l = (l - r) / l * alpha;
        //           d.x -= x *= l;
        //           d.y -= y *= l;
        //           quad.point.x += x;
        //           quad.point.y += y;
        //         }
        //       }
        //       return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
        //     });
        //   };
        // }


        // animation on mouse hover to show top/first quote
        gnodes.on("mouseover", function(d) {
            d3.select(this).select('text').transition().duration(800).attr('font-size', '1.3em');
            d3.select(this).select('circle').transition().duration(800).attr('r', function(d) {
                return d.r * 1.2;
              })
              .style('opacity', 0.9);
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

        // Add force layout


      });
    }
  };
});