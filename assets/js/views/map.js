define (['underscore', 'marionette', 'd3', 'vent', 'loading', 'topojson'],
function (_, Marionette, d3, Vent, loadQueue, topojson) {
        var map; /* hack */


        var itemView = Marionette.ItemView.extend ({
                initialize: function () {

                },
                template: function (data) {
                        // hack: we don't need any templating, it's all
                        // handled by d3
                },
                onDestroy: function () {
                        this.marker.remove();
                }
        });


        var mapView = Marionette.ItemView.extend ({
                template: function (data) {
                },
                config: {zoom: 5, center: [-40.17887331434695, -63.896484375]},
                onShow: function () {
                        console.log ('init', $('#map'));
                        var m_width = $("#map").width(),
                            width = 938,
                            height = 500,
                            country,
                            state;
                        var domain0 = [+new Date(1950, 0, 1), +new Date(1990, 0, 1)],
                            domain1 = [+new Date(2000, 1, 1), +new Date(2000, 1, 2)];

                        var x = d3.time.scale.utc()
                                    .domain(domain0)
                                    .range([0, width]);

                        var brush = d3.svg.brush()
                                    .x(x)
                                    .extent([0, 0])
                                    .on("brush", brushed);

                        var xAxis = d3.svg.axis()
                                    .scale(x)
                        /*    .orient("bottom")
                         .tickFormat(function(d) { return d + "°"; })
                         .tickSize(0)
                         .tickPadding(12)*/;

                        var projection = d3.geo.mercator()
                                    .scale(150)
                                    .translate([width / 2, height / 1.5]);

                        var path = d3.geo.path()
                                    .projection(projection);

                        var svg = d3.select("#map").append("svg")
                                    .attr("preserveAspectRatio", "xMidYMid")
                                    .attr("viewBox", "0 0 " + width + " " + height)
                                    .attr("width", m_width)
                                    .attr("height", m_width * height / width);

                        svg.append("rect")
                                .attr("class", "background")
                                .attr("width", width)
                                .attr("height", height)
                                .on("click", country_clicked);

                        var g = svg.append("g")
                                    .attr ('class', 'map');

                        var gAxis = svg.append("g")
                                    .attr("class", "x axis")
                                    .attr("height", 20)
                                    .attr("transform", "translate(0,20)");

                        gAxis.call(xAxis)
                                .select(".domain")
                                .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
                                .attr("class", "halo");


                        var slider = gAxis.append("g")
                                    .attr("class", "slider")
                                    .attr("height", 20)
                                    .call(brush);

                        slider.selectAll(".extent,.resize")
                                .remove();

                        slider.select(".background")
                                .attr("height", height);

                        var handle = slider.append("circle")
                                    .attr("class", "handle")
                                    .attr("r", 9);

                        slider
                                .call(brush.event)
                                .transition() // gratuitous intro!
                                .duration(750)
                                .call(brush.extent([70, 70]))
                                .call(brush.event);

                        function brushed() {
                                var value = brush.extent()[0];

                                if (d3.event.sourceEvent) { // not a programmatic event
                                        value = x.invert(d3.mouse(this)[0]);
                                        brush.extent([value, value]);
                                }

                                handle.attr("cx", x(value));
                        }
                        d3.json("/assets/json/people.json", function (error, people) {
                                var g = svg.append('g')
                                            .attr('class', 'people');

                                _.each (people, function (p) {
                                        console.log (p);
                                });
                                var data  = _.pluck(people, 'dates');
                                console.log (data, people, error);
                        });

                        d3.json("/assets/json/countries.topo.json", function(error, us) {
                                g.append("g")
                                        .attr("id", "countries")
                                        .selectAll("path")
                                        .data(topojson.feature(us, us.objects.countries).features)
                                        .enter()
                                        .append("path")
                                        .attr("id", function(d) { return d.id; })
                                        .attr("d", path)
                                        .on("click", country_clicked);
                        });

                        function zoom(xyz) {
                                g.transition()
                                        .duration(750)
                                        .attr("transform", "translate(" + projection.translate() + ")scale(" + xyz[2] + ")translate(-" + xyz[0] + ",-" + xyz[1] + ")")
                                        .selectAll(["#countries", "#states", "#cities"])
                                        .style("stroke-width", 1.0 / xyz[2] + "px")
                                        .selectAll(".city")
                                        .attr("d", path.pointRadius(20.0 / xyz[2]));
                        }

                        function get_xyz(d) {
                                var bounds = path.bounds(d);
                                var w_scale = (bounds[1][0] - bounds[0][0]) / width;
                                var h_scale = (bounds[1][1] - bounds[0][1]) / height;
                                var z = .96 / Math.max(w_scale, h_scale);
                                var x = (bounds[1][0] + bounds[0][0]) / 2;
                                var y = (bounds[1][1] + bounds[0][1]) / 2 + (height / z / 6);
                                return [x, y, z];
                        }

                        function country_clicked(d) {
                                g.selectAll(["#states", "#cities"]).remove();
                                state = null;

                                if (country) {
                                        g.selectAll("#" + country.id).style('display', null);
                                }

                                if (d && country !== d) {
                                        var xyz = get_xyz(d);
                                        country = d;

                                        if (d.id == 'ARG' || d.id  == 'CHL' || d.id == 'CUB') {
                                                d3.json("/assets/json/states_" + d.id.toLowerCase() + ".topo.json", function(error, ctry) {
                                                        g.append("g")
                                                                .attr("id", "states")
                                                                .selectAll("path")
                                                                .data(topojson.feature(ctry, ctry.objects.states).features)
                                                                .enter()
                                                                .append("path")
                                                                .attr("id", function(d) { return d.id; })
                                                                .attr("class", "active")
                                                                .attr("d", path)
                                                                .on("click", state_clicked);

                                                        zoom(xyz);
                                                        g.selectAll("#" + d.id).style('display', 'none');
                                                });      
                                        } else {
                                                zoom(xyz);
                                        }
                                } else {
                                        var xyz = [width / 2, height / 1.5, 1];
                                        country = null;
                                        zoom(xyz);
                                }
                        }

                        function state_clicked(d) {
                                g.selectAll("#cities").remove();

                                if (d && state !== d) {
                                        var xyz = get_xyz(d);
                                        state = d;

                                        country_code = state.id.substring(0, 3).toLowerCase();
                                        state_name = state.properties.name;

                                        d3.json("/assets/json/cities_" + country_code + ".topo.json", function(error, us) {
                                                g.append("g")
                                                        .attr("id", "cities")
                                                        .selectAll("path")
                                                        .data(topojson.feature(us, us.objects.cities).features.filter(function(d) { return state_name == d.properties.state; }))
                                                        .enter()
                                                        .append("path")
                                                        .attr("id", function(d) { return d.properties.name; })
                                                        .attr("class", "city")
                                                        .attr("d", path.pointRadius(20 / xyz[2]));

                                                zoom(xyz);
                                        });
                                } else {
                                        state = null;
                                        country_clicked(country);
                                }
                        }
                        $(window).resize(function() {
                                var w = $("#map").width();
                                svg.attr("width", w);
                                svg.attr("height", w * height / width);
                        });
                }
        });

                return mapView;
        });
