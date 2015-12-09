app.directive('resourceBars', function($parse, PlayGameFactory) {
    return {
        restrict: 'E',
        replace: true,
        template: '<div id="resourceChart"></div>',
        scope: {
            resourceMarket: '=',
            resourceColors: '=',
            resourceWishlist: '='
        },
        link: function (scope, element, attrs) {

            var margin = {top: 20, right: 20, bottom: 0, left: 0},
                width = 450 - margin.left - margin.right,
                height = 225 - margin.top - margin.bottom;

            var xAmount = d3.scale.linear()
                .range([0, width])
                .domain([0,24]);

            var xNukeAmount = d3.scale.linear()
                .range([0, width])
                .domain([0,12]);

            var xPrice = d3.scale.linear()
                .range([0, width])
                .domain([9,1]);

            var xNukePrice = d3.scale.linear()
                .range([0, width])
                .domain([13,1]);

            var y = d3.scale.ordinal()
                .rangeRoundBands([0, height]);

            var ticks = [];
            for(var i = 1; i < 8.9; i+=(1/3)) ticks.push(i.toFixed(4))

            var xPriceAxis = d3.svg.axis()
                .scale(xPrice)
                .orient('bottom')
                .tickValues(ticks)
                .tickSize(5,0)
                .tickFormat(function(d) {
                    if(d % 1 !== 0) return;
                    return "$" + Math.floor(d);
                });

            var xNukePriceAxis = d3.svg.axis()
                .scale(xNukePrice)
                .orient('bottom')
                .tickValues([1,2,3,4,5,6,7,8])
                .tickSize(5,0)
                .tickFormat(function(d) { return "$"+d; });

            var yAxis = d3.svg.axis()
                .scale(y)
                .orient('left');

            var svg = d3.select('#resourceChart')
                .append('svg')
                .attr('class', 'resourceSVG')
                .attr('width', 450)
                .attr('height', 225)
                .append('g')
                .attr('id', 'collection')
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            svg.selectAll('#priceAxis')
                .data(['coal', 'oil', 'trash', 'nuke']).enter()
                .append('g')
                .attr('id', 'priceAxis')
                .attr("transform", function(d,i) {return "translate(0," + (24+(i*51)) + ")"})
                .attr('class', 'xPrice axis')
                .attr('fill', 'white')
                .attr('visibility', function(d,i) {
                    if(d === 'nuke') return 'hidden';
                })
                .call(xPriceAxis);

            svg.selectAll('#priceNukeAxis')
                .data(['coal', 'oil', 'trash', 'nuke']).enter()
                .append('g')
                .attr('id', 'priceNukeAxis')
                .attr("transform", function(d,i) {return "translate(0," + (24+(i*51)) + ")"})
                .attr('class', 'xNukePrice axis')
                .attr('fill', 'white')
                .attr('visibility', function(d,i) {
                    if(d !== 'nuke') return 'hidden';
                })
                .call(xNukePriceAxis);

             var nukeTicksCollection = svg.selectAll('#nukeTicks')
                .data([16,14,12,10]).enter()
                .append('g')
                .attr('id', 'nukeTicks')
                .attr('class', 'axis')
                .attr("transform", function(d,i) {return "translate(" + ((i+1)*(35+(5/6))) + ",177)"});

             var nukeTicks = nukeTicksCollection
                .each(function(d,i) {
                    d3.select(this)
                        .append('line')
                        .attr('y2', 5)
                        .attr('x2', 0)
                        .attr('fill', 'none')
                        .attr('stroke', 'white');
                    d3.select(this)
                        .append('text')
                        .attr('dy', '.71em')
                        .attr('y', 8)
                        .attr('x', 0)
                        .attr("text-anchor", "middle")
                        .text(function(d) { return '$' + d; })
                        .attr("font-family", "orbitron")
                        .attr('font-size', 10)
                        .attr("fill", "white");
                });

            svg.selectAll('.text')
                .data(['coal', 'oil', 'trash', 'uranium']).enter()
                .append('text')
                .attr('class', 'text')
                .attr('x', 5)
                .attr("transform", function(d,i) {return "translate(0," + (14+(i*51)) + ")"})
                .text(function(d) { return d; })
                .attr("font-family", "orbitron")
                .attr("font-size", 9)
                .attr("fill", "white");

            y.domain(['coal', 'oil', 'trash', 'nuke']);

            var resourceColors = {
                coal: '#C8824D',
                oil: 'black',
                trash: '#A8A818',
                nuke: 'red'
            };

            var resourceBars = svg.selectAll('.bar')
                .data(['coal', 'oil', 'trash', 'nuke']).enter()
                .insert('rect', '.text')
                .attr('class', 'bar')
                .style('fill', function(d) { return resourceColors[d]; })
                .attr('id', function(d) { return d; })
                .attr('y', function(d) { return y(d) - 3; })
                .attr('height', 25);

            var wishlistBars = svg.selectAll('.wishlistBar')
                .data(['coal', 'oil', 'trash', 'nuke']).enter()
                .insert('rect', '.text')
                .attr('class', 'wishlistBar')
                .style('fill', 'white')
                .attr('opacity', 0.5)
                .attr('id', function(d) { return 'wishlist' + d; })
                .attr('y', function(d) { return y(d) - 3; })
                .attr('height', 25);


            scope.$watch('resourceMarket', function(resourceMarket) {
                if(resourceMarket) {
                    var resources = [];
                    for (var key in resourceMarket) {
                        if(key !== 'nuke') resources.push({ value: resourceMarket[key], type: key, color: scope.resourceColors[key] });
                    }
                    resources.push({ value: resourceMarket['nuke'], type: 'nuke', color: scope.resourceColors['nuke']});
                    
                    resources.forEach(function(resource) {
                        var resourceVal = resource.value;
                        var resourceType = resource.type;
                        
                        d3.select('#' + resource.type)
                            .transition().duration(2000).ease('elastic')
                            .attr('width', function(resource) {
                                if(resourceType === 'nuke') return xNukeAmount(resourceVal);
                                return xAmount(resourceVal);
                            });
                    });
                }

            }, true);


            scope.$watch('resourceWishlist', function(wishlistObj) {
                if(wishlistObj && scope.resourceMarket) {
                    var wishlist = [];
                    for(var key in wishlistObj) {
                        wishlist.push({ value: wishlistObj[key], type: key, color: scope.resourceColors[key] })
                    }
                    wishlist.forEach(function(resource) {
                        var wishlistVal = resource.value;
                        var wishlistType = resource.type;
                        var actualVal = scope.resourceMarket[wishlistType];

                        d3.select('#wishlist' + resource.type)
                            .transition().duration(1000)
                            .attr('x', function(resource) {
                                if(wishlistType === 'nuke') return xNukeAmount(actualVal - wishlistVal);
                                return xAmount(actualVal - wishlistVal);
                                })
                            .attr('width', function(resource) {
                                if(wishlistType === 'nuke') return xNukeAmount(wishlistVal);
                                return xAmount(wishlistVal);
                            })
                    })
                }

            }, true);

        }
    };
});