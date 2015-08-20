angular.module('poliviz.committeeController', [])
.controller('committeeController', function($scope, contributorsCandidatesData){
  
  //list of abbreviated states
  $scope.states = ["AL","AK","AS","AZ","AR","CA","CO","CT","DE","DC","FM","FL","GA",
                   "GU","HI","ID","IL","IN","IA","KS","KY","LA","ME","MH","MD","MA",
                   "MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND",
                   "MP","OH","OK","OR","PW","PA","PR","RI","SC","SD","TN","TX","UT",
                   "VT","VI","VA","WA","WV","WI","WY"];

  // Sets the default select/option
  $scope.contrib = "ALL";
  $scope.partyAffil = "ALL";
  $scope.candOffice = "ALL";
  $scope.candState = "ALL";
  $scope.group = "CAND";

  $scope.id = undefined;

  // filters the data based on party affiliation
  $scope.selectFilter = function () {

    contributorsCandidatesData.getCandidate($scope.id)
      .then(function(data){
        console.log(data);
      });

    var request;
    if ($scope.group === "CAND") {

      if (!$scope.id) {
        request = contributorsCandidatesData.getCandidates;
      } else {
        request = contributorsCandidatesData.getCandidate;
      }
    } else {

      if (!$scope.id) {
        request = contributorsCandidatesData.getContributors;
      } else {
        request = contributorsCandidatesData.getContributor;
      }
    }

    request($scope.id)
      .then(function(data){
        $scope.data = data;
        if ($scope.partyAffil !== "ALL") {
          $scope.data = $scope.data.filter(function(d){
            return d.party === $scope.partyAffil;
          });
        }
        if ($scope.candOffice !== "ALL") {
          $scope.data = $scope.data.filter(function(d){
            return d.position === $scope.candOffice;
          });
        }
        if ($scope.candState !== "ALL") {
          $scope.data = $scope.data.filter(function(d){
            return d.state === $scope.candState;
          });
        }
      });
  };
  $scope.selectFilter();
})

//directive for displaying chart
.directive("myChart", function($window) {
  return {
    restrict: "EA",
    template: "<svg width='850' height='200'></svg>",
    link: function(scope, elem, attrs) {
      scope.$watchGroup(['data'], function() {
        // remove any previous charts
        d3.selectAll('svg').remove();
        var data = scope.data;
        var contribType = '';

        // check for contribution type selected
        if(scope.contrib === 'ALL') {
          contribType = 'total$';
        } else if(scope.contrib === 'PAC') {
          contribType = 'pac$';
        } else if(scope.contrib === 'PP') {
          contribType = 'party$';
        } else if(scope.contrib === 'I') {
          contribType = 'individual$';
        } else if(scope.contrib === 'C') {
          contribType = 'candidate$';
        }

        //sort data, largest to smallest contributions
        data.sort(function(a, b) {
          return b[contribType] - a[contribType];
        });

        var height = 800;
        var width = 1050;
        //varibles to move datapoint to new line
        var yCounter = 10;
        var xCounter = 1;
        var rowSize = 50;
        var largestContribution = data[0][contribType];
        var svg = d3.select("my-chart").append("svg")
          .attr("width", width)
          .attr("height", height);
        
        // NOTE: move this into a factory? 
        d3.csv('committee/capitals.csv', function(error, capitals) {

          // create states hash with lat and long of capital abbrevs;
          var stateHash = {}
          capitals.forEach(function(capital) {
            var coords = stateHash[capital.abbrev] = {};
            coords.lat = (-Number(capital.latitude) + 52) * 25;
            coords.long = (Number(capital.longitude) + 140) * 14;
          })

          // Don't move this around;
          var force = d3.layout.force()
              .nodes(data)
              .size([width, height])
              .gravity(.02)
              .charge(0)
              .on("tick", tick)
              .start();

          var circles = svg.selectAll('circle')
              .data(data)
            .enter().append('circle')
              .style('fill', function(d) { //color bubbles based on party affiliation
                if(d["industry"] === "C"){
                  return '#5E412F';
                } 
                if(d["industry"] === "L"){
                  return '#F0A830';
                } 
                if(d["industry"] === "M"){
                  return '#F07818';
                } 
                if(d["industry"] === "T"){
                  return '#78C0A8';
                } 
                if(d["industry"] === "V"){
                  return '#FCEBB6';
                } 
                if(d["industry"] === "W"){
                  return '#c07890';
                } 
                if (d["party"] === "REP") {
                  return 'red';
                } else if (d["party"] === "DEM") {
                  return 'blue';
                } else {
                  return 'green';
                }
              })
              .attr('r', function(d) { //set max and min bubble size for visual purposes
                var radius = function(value) { 
                  if (value < 50) {
                    value = 50;
                  }
                  var minp = 2;
                  var maxp = 30;
                  var minv = Math.pow(1, .5);
                  var maxv = Math.pow(largestContribution, .5);
                  var scale = (maxv-minv) / (maxp-minp);
                  return (Math.pow(value, .5)-minv) / scale + minp;
                }
                d.radius = radius(d[contribType]);
                return radius(d[contribType])
              })
              .call(force.drag);

          d3.select(self.frameElement).style("height", height + "px");

          function collide(alpha) {
            var quadtree = d3.geom.quadtree(data);
            return function(d) {
              var r = d.radius + 10,
                  nx1 = d.x - r,
                  nx2 = d.x + r,
                  ny1 = d.y - r,
                  ny2 = d.y + r;
              quadtree.visit(function(quad, x1, y1, x2, y2) {
                if (quad.point && (quad.point !== d)) {
                  var x = d.x - quad.point.x,
                      y = d.y - quad.point.y,
                      l = Math.sqrt(x * x + y * y),
                      r = d.radius + quad.point.radius;
                  if (l < r) {
                    l = (l - r) / l * alpha;
                    d.x -= x *= l;
                    d.y -= y *= l;
                    quad.point.x += x;
                    quad.point.y += y;
                  }
                }
                return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
              });
            };
          }

          function tick(e) {

            var k = .2 * e.alpha;

            data.forEach(function(o, i) {
              var coords = stateHash[o.state] || {long: 10, lat: 10};
              o.y += ((coords.lat || 10) - o.y) * k;
              o.x += ((coords.long || 10) - o.x) * k;
            });

            circles
                .each(collide(.5))
                .attr("cx", function(d) { return d.x; })
                .attr("cy", function(d) { return d.y; });          
          }


          // Helper function to convert number to display as currency
          var convertCurrency = function(number) {
            var rounded = Math.round(number)
            return rounded.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
          };

          // Add tooltips for bubbles
          var tip = d3.tip()
            .attr('class', 'd3-tip')
            .offset([-10, 0])
            .html(function(d) {
              if(scope.contrib === 'ALL') {
                return "<h5>" + d['name'] + "</h5> <div class='miniQuote'> Total Raised:  $" + convertCurrency(d[contribType]) + "</div> \
                        <div class='miniQuote'> PAC Contributions:  $" + convertCurrency(d['pac$']) + "</div> \
                        <div class='miniQuote'> Political Partry Contributions:  $" + convertCurrency(d['party$']) + "</div> \
                        <div class='miniQuote'> Individual Contributions:  $" + convertCurrency(d['individual$']) + "</div> \
                        <div class='miniQuote'> Candidate Contributions:  $" + convertCurrency(d['candidate$']);
              } else {
                return "<h5>" + d['name'] + "</h5> <div class='miniQuote'> Total Raised: $" + convertCurrency(d[contribType]) + "</div>";
              }
            });

          circles.call(tip);

          d3.selectAll('circle').on("mouseover", function(d) {
              tip.show(d)
                .style('opacity', 0.8);
            })
            .on('mouseout', function(d) {
              tip.hide(d);
            })
            .on('click', function(d) {
              scope.id = d.id;
              if (d.party) {
                scope.group = 'CAND'
              } else {
                scope.group = 'CONTRIB'
              }
              scope.selectFilter();
            });
        });

      });
    }
  };
});