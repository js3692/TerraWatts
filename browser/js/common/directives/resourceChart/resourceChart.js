 app.directive('bars', function ($parse) {
     return {
         restrict: 'E',
         replace: true,
         template: '<div id="chart"></div>',
         scope: {
             data: '='
         },
         link: function (scope, element, attrs) {
             var data = [];
             scope.$watch('data', function (resources) {

                 for (var key in resources) {
                     data.push(resources[key]);
                     console.log(resources[key])
                 }

                 var chart = d3.select('#chart')
                     .append("div").attr("class", "chart")
                     .selectAll('div')
                     .data(data).enter()
                     .append("div")
                     .transition().ease("elastic")
                     .style("width", function (d) {
                         return d + "%";
                     })
                     .text(function (d) {
                         return d + "%";
                     });

             })
         }
     };
 });