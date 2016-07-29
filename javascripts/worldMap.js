(function(){
	var mapSvg = d3.select('#map').append("svg").attr("width", "1000").attr("height", "700").attr("class","worldMap"),
		projection = d3.geo.equirectangular().translate([600, 240]).scale(250),
		path = d3.geo.path().projection(projection),
		height = mapSvg.attr("height"),
		width = mapSvg.attr("width"),
		fillScale = d3.scale.linear().domain([0, 100]).range([ "#fff7f3", "#49006a"]),
		digitScale = d3.scale.category10();
		

	d3.json("javascripts/worldPaths.json", function(error, world) {
		if(error) {
			console.log("error in json");
		}
		var countries = world.features;
		var dict = {};
		var countryPaths = mapSvg.append("g");
		countryPaths.selectAll("path").data(countries).enter()
		.append("path")
		.attr("d", path);

		d3.json("datasets/worldData.json", function (error, entireJSONData) {
			var rows = entireJSONData.data; 
			var countryNames = [];
			var max =0, min =100;
			var maxCountry= [], minCountry=[], maxCountryValue=[], minCountryValue = [], comparisonCountries = [], comparisonCountriesValues=[];
			/* Read from CSV file and store into dictionary object, with keys as Country name and values as an object of time and mobile subscription value.
			dict = {
				"China" : [{
							"Time" : 2014,
							"Value" : 67
						  }],
				"United States" : [{
									"Time" : 2014,
									"Value" : 89
								   }
								   ],
			 	...
			}
		*/
			rows.forEach(function(country) {
				if(country.Time == "2014-01-01T00:00:00Z") {
					dict[country.location] = country.Value;
					if(max < country.Value) {
						max = country.Value;
						maxCountry.push(country.location);
						maxCountryValue.push(country.Value);
					}
					if(min >= country.Value) {
						min = country.Value;
						minCountry.push(country.location);
						minCountryValue.push(country.Value);
					}
				}				
			});
			comparisonCountries = ["United States","Mexico","China", "India","Libya"];
			/* Drawing the gradient scale*/
			var gradient = mapSvg.append("svg:defs")
							    .append("svg:linearGradient")
							    .attr("id", "gradient")
							    .attr("x1", "0%")
							    .attr("y1", "100%")
							    .attr("x2", "100%")
							    .attr("y2", "100%")
							    .attr("spreadMethod", "pad");

			gradient.append("svg:stop")
				    .attr("offset", "0%")
				    .attr("stop-color", "#fff7f3")
				    .attr("stop-opacity", 1);

			gradient.append("svg:stop")
				    .attr("offset", "100%")
				    .attr("stop-color", "#49006a")
	    			.attr("stop-opacity", 1);

			mapSvg.append("rect")
					.attr("x", 100)
					.attr("y", 550)
					.attr("width", 1000)
					.attr("height", 20)
					.style("stroke","none")
					.attr('fill', 'url(#gradient)');
			
			/*Plotting countries on the gradient scale*/
			var j =0;
			for(var i =0; i<5; i++) {
				mapSvg.append("text")
						.attr("x", 100+(1000/100*dict[comparisonCountries[i]]))
						.attr("y", (j*20)+590)
						.text(comparisonCountries[i]);
				j = (j==0 ? -3 : 0);
			}

			mapSvg.append("text")
						.attr("x", 80)
						.attr("y", 565)
						.text("0");
			mapSvg.append("text")
						.attr("x", 1110)
						.attr("y", 565)
						.text("100")

			/*Filling the countries based on the value*/
			countryPaths.selectAll("path")
			.style("fill", function (country) {
				var countryName = country.properties.name;
				var value = dict[countryName];
				if(!value) return "none";
				return fillScale(value);
			})
		});
	});

})();