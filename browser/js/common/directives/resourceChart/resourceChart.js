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

            var margin = {top: 20, right: 20, bottom: 20, left: 20},
                width = 450 - margin.left - margin.right,
                height = 225 - margin.top - margin.bottom,
                yBuffer = 20;

            var x = d3.scale.linear()
                .range([width, 0]);

            var y = d3.scale.ordinal()
                .rangeRoundBands([0, height], .1);

            var xAxis = d3.svg.axis()
                .scale(x)
                .orient('bottom');

            var yAxis = d3.svg.axis()
                .scale(y)
                .orient('left');

            var svg = d3.select('#resourceChart')
                .append('svg')
                .attr('class', 'resourceSVG')
                .attr('width', width)
                .attr('height', height)
                .append('g');


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
                        .call(xAxis)
                        .append('text')
                        .attr('transform', 'rotate(90)')
                        .attr('x', 6)
                        .attr('dx', '.71em')
                        .style('text-anchor', 'end')
                        .text('TEXTICLES');

                    svg.append('g')
                        .attr('class', 'y axis')
                        .attr("transform", "translate(0," + width + ")")
                        .call(yAxis);

                    svg.selectAll('.bar')
                        .data(resources)
                        .enter()
                        .append('rect')
                        .attr('class', 'bar')
                        // .attr('x', function(d) { return x(d.value); })
                        .attr('x', 0)
                        .attr('width', function(d) { return width - x(d.value); })
                        .attr('y', function(d) { return y(d.type); })
                        .attr('height', y.rangeBand());

                    svg.selectAll('.text')
                        .data(resources)
                        .enter()
                        .append('text')
                        .attr('class', 'text')
                        .attr('x', function(d) { return width - x(d.value) - 3; })
                        .attr('y', function(d) { return y(d.type); })
                        .text(function(d) { return d.value; })
                        .style('text-anchor', 'end')
                        .attr("font-family", "sans-serif")
                        .attr("font-size", 10)
                        .attr("fill", "white")



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