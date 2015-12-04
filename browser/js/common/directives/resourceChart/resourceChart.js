app.directive('bars', function ($parse) {
    return {
        restrict: 'E',
        replace: true,
        template: '<div id="resourceChart"></div>',
        scope: {
            data: '=',
            resourceColors: '='
        },
        link: function (scope, element, attrs) {

            var margin = {top: 20, right: 20, bottom: 0, left: 15},
                width = 450 - margin.left - margin.right,
                height = 225 - margin.top - margin.bottom;
                // width = 450,
                // height = 225;

            var x = d3.scale.linear()
                // .range([width, 0]);
                .range([0, width]);

            var y = d3.scale.ordinal()
                .rangeRoundBands([0, height], .1);

            var xAxis = d3.svg.axis()
                .scale(x)
                // .orient('bottom');
                .orient('top');

            var yAxis = d3.svg.axis()
                .scale(y)
                .orient('left');

            var svg = d3.select('#resourceChart')
                .append('svg')
                .attr('class', 'resourceSVG')
                // .attr('width', width)
                // .attr('height', height)
                .attr('width', 450)
                .attr('height', 225)
                .append('g')
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


            scope.$watch('data', function (data) {
                var resources = [];
                if(data) {

                    for (var key in data) {
                        resources.push({ value: data[key], type: key, color: scope.resourceColors[key]});
                    }
                    console.log('resources', resources)

                    y.domain(resources.map(function(resource) { return resource.type; }));
                    x.domain([0, d3.max(resources, function(resource) { return resource.value; })]);

                    svg.append('g')
                        .attr('class', 'x axis')
                        .attr('fill', 'white')
                        .call(xAxis)
                        .append('text')
                        .attr('transform', 'rotate(0)')
                        .attr('x', 6)
                        .attr('dx', '.71em')
                        .style('text-anchor', 'end')
                        .text('TEXT');

                    // svg.append('g')
                    //     .attr('class', 'y axis')
                    //     .attr("transform", "translate(0," + width + ")")
                    //     .call(yAxis);

                    svg.selectAll('.bar')
                        .data(resources)
                        .enter()
                        .append('rect')
                        .attr('class', 'bar')
                        // .attr('x', function(d) { return x(d.value); })
                        .attr('id', function(d,i) { return d.type; })
                        .attr('x', 0)
                        .attr('width', function(d,i) {
                            console.log('i width', width)
                            console.log('i x(d.value)', x(d.value))
                            // return width - x(d.value);
                            return x(d.value);
                        })
                        .attr('y', function(d) {
                            console.log('y(d.type)', y(d.type))
                            return y(d.type)+5;
                        })
                        .attr('height', y.rangeBand());

                    // svg.selectAll('.text')
                    //     .data(resources)
                    //     .enter()
                    //     .append('text')
                    //     .attr('class', 'text')
                    //     .attr('x', function(d) { return width - x(d.value) - 3; })
                    //     .attr('y', function(d) { return y(d.type); })
                    //     .text(function(d) { return d.value; })
                    //     .style('text-anchor', 'end')
                    //     .attr("font-family", "sans-serif")
                    //     .attr("font-size", 10)
                    //     .attr("fill", "white")






                    // var chart = d3.select('#chart')
                    //     .append("div").attr("class", "chart")
                    //     .selectAll('div')
                    //     .data(data).enter()
                    //     .append("div")
                    //     .transition().ease("elastic")
                    //     .style("width", function (d) {
                    //         return (d.value/24)*94 + "%";
                    //     })
                    //     .style("background-color", function(d){
                    //         return d.color;
                    //     })
                    //     .style("box-sizing", function(){
                    //         return "border-box";
                    //     })
                    //     .text(function (d) {
                    //         return d.type + ': ' + d.value;
                    //     });
                    
                }

            })
        }
    };
});