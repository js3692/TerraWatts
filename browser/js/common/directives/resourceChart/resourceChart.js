app.directive('bars', function ($parse) {
    return {
        restrict: 'E',
        replace: true,
        template: '<div id="chart"></div>',
        scope: {
            data: '='
        },
        link: function (scope, element, attrs) {
            var resourceColors = {
                coal: 'brown',
                oil: 'black',
                trash: 'yellow',
                nuke: 'red'
            };

            scope.$watch('data', function (resources) {
                var data = [];

                for (var key in resources) {
                    data.push({ value: resources[key], type: key, color: resourceColors[key]});
                }
                var chart = d3.select('#chart')
                    .append("div").attr("class", "chart")
                    .selectAll('div')
                    .data(data).enter()
                    .append("div")
                    .transition().ease("elastic")
                    .style("width", function (d) {
                        return d.value + "%";
                    })
                    .style("background-color", function(d){
                        return d.color;
                    })
                    .text(function (d) {
                        return d.type;
                    });
            })
        }
    };
});