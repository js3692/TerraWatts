app.directive('zoomMap', function($parse) {
	return {
		restrict: 'E',
		replace: true,
		template: '<div class="map"></div>',
		scope: {
			data: '='
		},
		link: function(scope, element, attrs) {

			console.log('inside zoom directive')

			var width = Math.max(960, window.innerWidth),
			    height = Math.max(500, window.innerHeight);

			var tile = d3.geo.tile()
			    .size([width, height]);

			var projection = d3.geo.mercator()
			    .scale((1 << 12) / 2 / Math.PI)
			    .translate([width / 2, height / 2]);

			var center = projection([-100, 40]);

			var path = d3.geo.path()
			    .projection(projection);

			var zoom = d3.behavior.zoom()
			    .scale(projection.scale() * 2 * Math.PI)
			    .scaleExtent([1 << 11, 1 << 14])
			    .translate([width - center[0], height - center[1]])
			    .on("zoom", zoomed);

			var svg = d3.select("body").append("svg")
			    .attr("width", width)
			    .attr("height", height);

			var raster = svg.append("g");

			var vector = svg.append("path");



			d3.csv("/utils/maps/us-state-capitols.csv", type, function(error, capitals) {
			  if (error) throw error;

			  console.log('capitals', capitals)

			  svg.call(zoom);
			  vector.datum({type: "FeatureCollection", features: capitals});
			  zoomed();
			});


			


			// scope.$watch('data', function(newData, oldData) {
			// 	var capitals = newData.cities;
			// 	if(capitals) {

			// 		var capitalsObj = d3.entries(capitals);
			// 		console.log('capitalsObj', capitalsObj)

			// 		var typeCapitalsObj = type(capitalsObj);

			// 		d3.json(capitalsObj, type, function(error, capitalsObj) {
			// 			if (error) throw error;


			// 			svg.call(zoom);
			// 			vector.datum({type: "FeatureCollection", features: capitalsObj});
			// 			zoomed();
			// 		});

			// 	}
			// },true);




			function type(d) {
				console.log('d', d)
			  return {
			    type: "Feature",
			    properties: {
			      name: d.description,
			      state: d.name
			    },
			    geometry: {
			      type: "Point",
			      coordinates: [+d.longitude, +d.latitude]
			    }
			  };
			}

			function zoomed() {
			  var tiles = tile
			      .scale(zoom.scale())
			      .translate(zoom.translate())
			      ();

			  projection
			      .scale(zoom.scale() / 2 / Math.PI)
			      .translate(zoom.translate());

			  vector
			      .attr("d", path);

			  var image = raster
			      .attr("transform", "scale(" + tiles.scale + ")translate(" + tiles.translate + ")")
			    .selectAll("image")
			      .data(tiles, function(d) { return d; });

			  image.exit()
			      .remove();

			  image.enter().append("image")
			      .attr("xlink:href", function(d) { return "http://" + ["a", "b", "c"][Math.random() * 3 | 0] + ".tile.openstreetmap.org/" + d[2] + "/" + d[0] + "/" + d[1] + ".png"; })
			      .attr("width", 1)
			      .attr("height", 1)
			      .attr("x", function(d) { return d[0]; })
			      .attr("y", function(d) { return d[1]; });
			}
			
		 	

					
		}
	}
})