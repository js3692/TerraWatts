app.directive('resourceBars', function ($parse) {
    return {
        restrict: 'E',
        replace: true,
        template: '<div id="resourceChart"></div>',
        scope: {
            data: '=',
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

            // var xNukePrice = d3.scale.ordinal()
            //     .rangeRoundBands([0, width])
            //     .domain([16,14,12,10,8,7,6,5,4,3,2,1]);



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
                // .tickValues([3,6,9,12,15,18,21,24])
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
                // .tickValues([1,2,3,4,5,6,7,8,10,12,14,16])
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

            scope.$watch('data', function (data) {
                var resources = [];
                if(data) {
                    for (var key in data) {
                        if(key !== 'nuke') resources.push({ value: data[key], type: key, color: scope.resourceColors[key]});
                    }
                    resources.push({ value: data['nuke'], type: 'nuke', color: scope.resourceColors['nuke']});

                    console.log('resources', resources)

                    y.domain(resources.map(function(resource) { return resource.type; }));
                    // x.domain([0, d3.max(resources, function(resource) { return resource.value; })]);

                    svg.selectAll('#priceAxis')
                        .data(resources)
                        .enter()
                        .append('g')
                        .attr('id', 'priceAxis')
                        .attr("transform", function(d,i) {return "translate(0," + (27+(i*51)) + ")"})
                        .attr('class', 'xPrice axis')
                        .attr('fill', 'white')
                        .attr('visibility', function(d,i) {
                            if(d.type === 'nuke') return 'hidden';
                        })
                        .call(xPriceAxis);

                    svg.selectAll('#priceNukeAxis')
                        .data(resources)
                        .enter()
                        .append('g')
                        .attr('id', 'priceNukeAxis')
                        .attr("transform", function(d,i) {return "translate(0," + (27+(i*51)) + ")"})
                        .attr('class', 'xNukePrice axis')
                        .attr('fill', 'white')
                        .attr('visibility', function(d,i) {
                            if(d.type !== 'nuke') return 'hidden';
                        })
                        .call(xNukePriceAxis);

                    

                    svg.selectAll('.bar')
                        .data(resources)
                        .enter()
                        .append('rect')
                        .attr('class', 'bar')
                        .style('fill', function(d) { return d.color; })
                        .attr('id', function(d,i) { return d.type; })
                        .attr('x', 0)
                        .attr('width', function(d,i) {
                            if(d.type === 'nuke') return xNukeAmount(d.value);
                            return xAmount(d.value);
                        })
                        .attr('y', function(d) { return y(d.type); })
                        .attr('height', 25);

                    svg.selectAll('.text')
                        .data(resources)
                        .enter()
                        .append('text')
                        .attr('class', 'text')
                        // .attr('x', function(d) { return width - x(d.value) - 3; })
                        .attr('x', 5)
                        // .attr('y', function(d) { return y(d.type); })
                        .attr("transform", function(d,i) {return "translate(0," + (40+(i*51)) + ")"})
                        .text(function(d) { return d.type; })
                        // .style('text-anchor', 'end')
                        .attr("font-family", "sans-serif")
                        .attr("font-size", 9)
                        .attr("fill", "white")

                }

            })
        }
    };
});