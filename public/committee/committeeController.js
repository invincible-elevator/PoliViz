angular.module('poliviz.committeeController', [])
.controller('committeeController', function($scope, dataRetrieval, formating){

  dataRetrieval.getContributors();
  dataRetrieval.getCandidates();

  //list of abbreviated states
  $scope.states = ["AL","AK","AS","AZ","AR","CA","CO","CT","DE","DC","FM","FL","GA",
                   "GU","HI","ID","IL","IN","IA","KS","KY","LA","ME","MH","MD","MA",
                   "MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND",
                   "MP","OH","OK","OR","PW","PA","PR","RI","SC","SD","TN","TX","UT",
                   "VT","VI","VA","WA","WV","WI","WY"];

  // Sets the default select/option
  $scope.cycle = "2016";
  $scope.contrib = "ALL";
  $scope.partyAffil = "ALL";
  $scope.candOffice = "ALL";
  $scope.candState = "ALL";
  $scope.group = "Candidates";

  $scope.id = undefined;

  // filters the data based on party affiliation
  var lastData;
  $scope.updateData = function () {

    // set the request to be made based on scope parameters
    var request;
    if ($scope.group === "Candidates") {

      $scope.id = dataRetrieval.candidate($scope.name);

      if (!$scope.id) {
        $scope.other = "Candidates";
        request = dataRetrieval.getCandidates;
      } else {
        $scope.other = "Contributors";
        request = dataRetrieval.getCandidate;
      }
    } else {

      $scope.id = dataRetrieval.contributor($scope.name);

      if (!$scope.id) {
        $scope.other = "Contributors";
        request = dataRetrieval.getContributors;
      } else {
        $scope.other = "Candidates";
        request = dataRetrieval.getContributor;
      }
    }

    $scope.title = formating.name($scope.name);
    request($scope.id)
      .then(function(data){
        lastData = data;
        $scope.selectFilter();
      });

  };

  $scope.selectFilter = function () {

    $scope.data = lastData;
    setSearchOptions();
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
    if ($scope.cycle !== "ALL") {
      $scope.data = $scope.data.filter(function(d){
        return d.cycle === +$scope.cycle;
      });
    }
  }

  var setSearchOptions = function() {

    var data;
    if ($scope.group === "Candidates") {
      data = dataRetrieval.getCandidateData();
    } else {
      data = dataRetrieval.getContributorData();
    }

    data = data.filter(function(datum) {
      return datum.cycle === +$scope.cycle;
    })
    console.log(data)

    var options = [];
    data.forEach(function(datum) {
      options.push(datum.name);
    })
    $scope.options = options;
  }

  $scope.updateData();
})

//directive for displaying chart
.directive("myChart", function($window) {
  return {
    restrict: "dEA",
    // template: "<svg width='850' height='200'></svg>",
    link: function(scope, elem, attrs){

      var width = 1050;
      var height = 800;

      var svg = d3.select('my-chart').append('svg')
        .attr('width', width)
        .attr('height', height);


      var lower48 = d3.select("svg").append("svg:image")
          .attr("xlink:href", "assets/us_map.svg")
          .attr("width", width)
          .attr("height", height)
          // .attr("transform", scale(2))
          .attr("class","bg");

      var alaska = d3.select("svg").insert("svg:image")
          .attr("xlink:href", "assets/alaska.svg")
          .attr("width", 300)
          .attr("height", 300)
          .attr("y", -200)
          .attr("y", 500);

      var hawaii = d3.select("svg").insert("svg:image")
          .attr("xlink:href", "assets/hawaii.svg")
          .attr("width", 100)
          .attr("height", 100)
          .attr("x", 275)
          .attr("y", 600);

      scope.$watchGroup(['data'], function() {

        // remove any previous charts
        d3.selectAll('.cir').remove();
        d3.selectAll('.legend').remove();
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

        var largestContribution = data[0][contribType];

        // create legend
        var legendRectSize = 15;
        var legendSpacing = 5;
        var legendOffset = 30;

        var colorData;
        if (scope.other === 'Candidates') {
          colorData = [{name: 'Republican', color: 'red'},
                       {name: 'Democrat', color: 'blue'},
                       {name: 'Independent', color: 'green'}];
        } else {
          colorData = [{name: 'Corporation', color: '#5E412F'},
                       {name: 'Labor organization', color: '#F0A830'},
                       {name: 'Membership organization', color: '#F07818'},
                       {name: 'Trade association', color: '#78C0A8'},
                       {name: 'Cooperative', color: '#FCEBB6'},
                       {name: 'Corporation without capital stock', color: 'green'},]
        }

        var legend = svg.selectAll('.legend')
            .data(colorData)
          .enter()
            .append('g')
            .attr('class', 'legend')

        legend.append('rect')
            .attr('width', legendRectSize)
            .attr('height', legendRectSize)
            .attr('fill', function(d) {
              return d.color;
            })
            .attr('x', legendRectSize + legendOffset)
            .attr('y', function(d, i) {
              return (legendRectSize + legendSpacing) * i;
            });

        legend.append('text')
          .attr('x', 2 * legendRectSize + legendOffset + legendSpacing)
          .attr('y',  function(d, i) {
              return (legendRectSize + legendSpacing) * (i + .7);
            })
          .text(function(d) { return d.name; });

        // var lower48 = d3.select("svg").append("svg:image")
        //     .attr("xlink:href", "assets/us_map.svg")
        //     .attr("width", width)
        //     .attr("height", height)
        //     // .attr("transform", scale(2))
        //     .attr("class","bg");

        // NOTE: move this into a factory?
        d3.csv('committee/capitals.csv', function(error, capitals) {

          // create states hash with lat and long of capital abbrevs;
          var stateHash = {}
          capitals.forEach(function(capital) {
            var coords = stateHash[capital.abbrev] = {};
            coords.lat = (-Number(capital.latitude) + 55) * 23;
            coords.long = (Number(capital.longitude) + 125) * 18;
          })

          // Don't move this around;
          var force = d3.layout.force()
              .nodes(data)
              .size([width, height])
              .gravity(0)
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
                  return 'green';
                }
                if (d["party"] === "REP") {
                  return 'red';
                } else if (d["party"] === "DEM") {
                  return 'blue';
                } else {
                  return 'green';
                }
              })
              .attr('class', 'cir')
              .attr('r', function(d) { //set max and min bubble size for visual purposes
                var radius = function(value) {
                  if (value < 50) {
                    value = 50;
                  }
                  var minp = 2;
                  var maxp = 30;
                  var minv = Math.pow(1, .5);
                  var maxv = Math.pow(largestContribution, .5);
                  var scale = (maxv-minv) / (maxp-minp) * 1.5;
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

            var k = .1 * e.alpha;

            data.forEach(function(o, i) {
              var coords = stateHash[o.state] || {long: 10, lat: 10};
              o.y += ((coords.lat || 0) - o.y) * k;
              o.x += ((coords.long || 0) - o.x) * k;
            });

            circles
                .each(collide(.6))
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
                var htmlString = "<h5>" + d['name'] + "</h5> <div class='miniQuote'> Total Raised:  $" + convertCurrency(d[contribType]) + "</div>"
                if(convertCurrency(d['pac$']) !== 'NaN') {
                  htmlString += "<div class='miniQuote'> PAC Contributions:  $" + convertCurrency(d['pac$']) + "</div>";
                }
                if(convertCurrency(d['party$']) !== 'NaN') {
                  htmlString += "<div class='miniQuote'> Political Partry Contributions:  $" + convertCurrency(d['party$']) + "</div>";
                }
                if(convertCurrency(d['individual$']) !== 'NaN') {
                  htmlString += "<div class='miniQuote'> Individual Contributions:  $" + convertCurrency(d['individual$']) + "</div>";
                }
                if(convertCurrency(d['candidate$']) !== 'NaN') {
                  htmlString += "<div class='miniQuote'> Candidate Contributions:  $" + convertCurrency(d['candidate$']) + "</div>";
                }
                return htmlString;
              } else {
                return "<h5>" + d['name'] + "</h5> <div class='miniQuote'> Total Raised: $" + convertCurrency(d[contribType]) + "</div>";
              }
            });

          circles.call(tip);

          d3.selectAll('circle').on('mouseover', function(d) {
              tip.show(d)
                .style('opacity', 0.8);
            })
            .on('mouseout', function(d) {
              tip.hide(d);
            })
            .on('dblclick', function(d) {
              // scope.id = d.id;
              scope.name = d.name;
              if (d.party) {
                scope.group = 'Candidates'
              } else {
                scope.group = 'Contributions'
              }
              scope.updateData();
            });
        });

      });
    }
  };
});