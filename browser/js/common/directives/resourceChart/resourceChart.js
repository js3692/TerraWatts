app.directive('resourceBars', function ($parse) {
    return {
        restrict: 'E',
        replace: true,
        template: '<div id="resourceChart"></div>',
        scope: {
            resourceMarket: '=',
            resourceColors: '='
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

            var xAmountAxis = d3.svg.axis()
                .scale(xAmount)
                .orient('top')
                .tickValues([3,6,9,12,15,18,21,24])
                .tickSize(3,0);

            var xNukeAmountAxis = d3.svg.axis()
                .scale(xNukeAmount)
                .orient('top')
                .tickSize(3,0);

            var xPriceAxis = d3.svg.axis()
                .scale(xPrice)
                .orient('bottom')
                .tickValues([1,2,3,4,5,6,7,8])
                .tickSize(3,0)
                .tickFormat(function(d) { return "$"+d; });

            var xNukePriceAxis = d3.svg.axis()
                .scale(xNukePrice)
                .orient('bottom')
                .tickValues([1,2,3,4,5,6,7,8])
                .tickSize(3,0)
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
                .data(['coal', 'oil', 'trash', 'nuke'])
                .enter()
                .append('g')
                .attr('id', 'priceAxis')
                .attr("transform", function(d,i) {return "translate(0," + (27+(i*51)) + ")"})
                .attr('class', 'xPrice axis')
                .attr('fill', 'white')
                .attr('visibility', function(d,i) {
                    if(d === 'nuke') return 'hidden';
                })
                .call(xPriceAxis);

            svg.selectAll('#priceNukeAxis')
                .data(['coal', 'oil', 'trash', 'nuke'])
                .enter()
                .append('g')
                .attr('id', 'priceNukeAxis')
                .attr("transform", function(d,i) {return "translate(0," + (27+(i*51)) + ")"})
                .attr('class', 'xNukePrice axis')
                .attr('fill', 'white')
                .attr('visibility', function(d,i) {
                    if(d !== 'nuke') return 'hidden';
                })
                .call(xNukePriceAxis);

             var nukeTicksCollection = svg.selectAll('#nukeTicks')
                .data([16,14,12,10])
                .enter()
                .append('g')
                .attr('id', function(d,i) { return 'nukeTicks' + d; })
                .attr("transform", function(d,i) {return "translate(" + ((i+1)*(35+(5/6))) + ",180)"});

             var nukeLine = nukeTicksCollection
                .each(function(d,i) {
                    d3.select(this)
                        .append('line')
                        .attr('y2', 3)
                        .attr('x2', 0)
                        .attr('fill', 'none')
                        .attr('stroke', 'white');
                    d3.select(this)
                        .append('text')
                        .attr('dy', '.71em')
                        .attr('y', 6)
                        .attr('x', 0)
                        .attr("text-anchor", "middle")
                        .text(function(d) { return '$' + d; })
                        .attr("font-family", "sans-serif")
                        .attr('font-size', 10)
                        .attr("fill", "white");
                });

            svg.selectAll('.text')
                .data(['coal', 'oil', 'trash', 'nuke'])
                .enter()
                .append('text')
                .attr('class', 'text')
                .attr('x', 5)
                .attr("transform", function(d,i) {return "translate(0," + (17+(i*51)) + ")"})
                .text(function(d) { return d; })
                .attr("font-family", "sans-serif")
                .attr("font-size", 9)
                .attr("fill", "white");

            y.domain(['coal', 'oil', 'trash', 'nuke']);

            var resourceBars = svg.selectAll('.bar')
                .data(['coal', 'oil', 'trash', 'nuke'])
                .enter()
                .insert('rect', '.text')
                .attr('class', 'bar')
                // .style('fill', function(d) { return d.color; })
                .attr('id', function(d,i) { return d; })
                .attr('x', 0)
                .attr('width', 50)
                .attr('y', function(d) { return y(d); })
                .attr('height', 25);


            scope.$watch('resourceMarket', function (resourceMarket) {
                var resources = [];
                if(resourceMarket) {
                    for (var key in resourceMarket) {
                        if(key !== 'nuke') resources.push({ value: resourceMarket[key], type: key, color: scope.resourceColors[key]});
                    }
                    resources.push({ value: resourceMarket['nuke'], type: 'nuke', color: scope.resourceColors['nuke']});

                    resources.forEach(function(resource) {
                        var resourceVal = resource.value;
                        d3.select('#' + resource.type)
                            .transition().duration(1000).ease('elastic')
                            .attr('width', function(resource) {
                                if(resource.type === 'nuke') return xNukeAmount(resourceVal);
                                return xAmount(resourceVal);
                            });
                    });


                }

            })
        }
    };
});