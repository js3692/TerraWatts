app.factory('RegionSelectorFactory', function () {

    var map = {};

    map.draw = function (selector, selectedRegions, selectedMap) {
        var svg = d3.select("#region-selector");
        var bbox = svg.node().getBoundingClientRect();
        var projection, path;

        var regionOneIds, regionTwoIds, regionThreeIds, regionFourIds, regionFiveIds;

    if(selectedMap === "United States") {
            regionOneIds = [8, 16, 30, 31, 41, 53, 56];
            regionTwoIds = [17, 18, 19, 21, 27, 38, 39, 46, 47, 55];
            regionThreeIds = [9, 10, 11, 23, 24, 25, 26, 33, 34, 36, 42, 43, 44, 50];
            regionFourIds = [4, 6, 32, 35, 49];
            regionFiveIds = [1, 5, 20, 22, 28, 29, 40, 48];

        projection = d3.geo.albers()
            .scale(bbox.width)
            .translate([bbox.width / 2, bbox.height / 2]);

        path = d3.geo.path().projection(projection);

            d3.json("/utils/maps/us.json", function(error, us) {
                if (error) return console.error(error);

                // Remove Alaska, Hawaii, etc.
                _.remove(us.objects.states.geometries, state => state.id === 2 || state.id === 15 || state.id > 56);

                // "states" contain the rest of the states, i.e. continental states
                var states = us.objects.states.geometries.slice();

                // Each region has an array of geometries
                var regionOne = _.remove(states, function (state) { return regionOneIds.some(id => id === state.id); });
                var regionTwo = _.remove(states, function (state) { return regionTwoIds.some(id => id === state.id); });
                var regionThree = _.remove(states, function (state) { return regionThreeIds.some(id => id === state.id); });
                var regionFour = _.remove(states, function (state) { return regionFourIds.some(id => id === state.id); });
                var regionFive = _.remove(states, function (state) { return regionFiveIds.some(id => id === state.id); });
                var regionSix = states;

                var regions = [regionOne, regionTwo, regionThree, regionFour, regionFive, regionSix];

                var convert = {
                    1: { name: 'one', selected: false, color: 'purple' },
                    2: { name: 'two', selected: false, color: 'yellow' },
                    3: { name: 'three', selected: false, color: 'brown' },
                    4: { name: 'four', selected: false, color: 'blue' },
                    5: { name: 'five', selected: false, color: 'red' },
                    6: { name: 'six', selected: false, color: 'green' }
                };

                if(selectedRegions) {
                    selectedRegions.forEach(function (regionId) {
                        convert[regionId].selected = true;
                    });
                }

                regions.forEach(function (elem, index) {
                    us.objects.states.geometries = elem;
                    svg.append("g").append("path")
                .datum(topojson.feature(us, us.objects.states))
                .attr("d", path)
                .classed("region-" + convert[index + 1].name, true)
                .classed("region-selected", convert[index + 1].selected)
                .attr("fill", convert[index + 1].color)
                .attr("opacity", 0.25)
                .on("mouseenter", function () {
                    d3.select(this).attr("opacity", 0.5);
                })
                .on("mouseout", function () {
                    d3.select(this).attr("opacity", 0.15);
                })
                .on("click", function () {
                    selector(index);
                });
                });
            });
    } else if (selectedMap === "Germany") {
        regionOneIds = [11583, 11559, 11566, 11558, 11565, 11567];
            regionTwoIds = [11582, 11580, 11557, 11556, 11563];
            regionThreeIds = [11562, 11569, 11570, 11572, 11568];
            regionFourIds = [11564, 11549, 11552, 11555, 11584, 11581, 11579, 11577, 11578];
            regionFiveIds = [11546, 11560, 11561, 11574, 11573, 11576, 11575, 11571];

        projection = d3.geo.mercator()
            .scale(bbox.width * 2.2)
        .center([10.437274617500082,51.333495750273435])
            .translate([bbox.width / 2, bbox.height / 2]);

        path = d3.geo.path().projection(projection);

            d3.json("/utils/maps/germany.json",function(error, germany) {
                if (error) return console.log(error);

                // "states" contain the rest of the states, i.e. continental states
                var states = germany.objects.states.geometries.slice();

                var regionOne = _.remove(states, function (state) { return regionOneIds.some(id => id === state.id); });
                var regionTwo = _.remove(states, function (state) { return regionTwoIds.some(id => id === state.id); });
                var regionThree = _.remove(states, function (state) { return regionThreeIds.some(id => id === state.id); });
                var regionFour = _.remove(states, function (state) { return regionFourIds.some(id => id === state.id); });
                var regionFive = _.remove(states, function (state) { return regionFiveIds.some(id => id === state.id); });
                var regionSix = states;

                var regions = [regionOne, regionTwo, regionThree, regionFour, regionFive, regionSix];

                var convert = {
                    1: { name: 'one', selected: false, color: 'yellowgreen' },
                    2: { name: 'two', selected: false, color: 'sienna' },
                    3: { name: 'three', selected: false, color: 'firebrick' },
                    4: { name: 'four', selected: false, color: 'gold' },
                    5: { name: 'five', selected: false, color: 'royalblue' },
                    6: { name: 'six', selected: false, color: 'blueviolet' }
                };

                if(selectedRegions) {
                    selectedRegions.forEach(function (regionId) {
                        convert[regionId].selected = true;
                    });
                }

                regions.forEach(function (elem, index) {
                    germany.objects.states.geometries = elem;
                    svg.append("g").append("path")
                .datum(topojson.feature(germany, germany.objects.states))
                .attr("d", path)
                .classed("region-" + convert[index + 1].name, true)
                .classed("region-selected", convert[index + 1].selected)
                .attr("fill", convert[index + 1].color)
                .on("mouseenter", function () {
                    d3.select(this).attr("opacity", 0.5);
                })
                .on("mouseout", function () {
                    d3.select(this).attr("opacity", 1);
                })
                .on("click", function () {
                    selector(index);
                });
                });

            });

    }

    }

    return map;

});
