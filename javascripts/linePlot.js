(function(){
	var linePlotSvg = d3.select("#internetLinePlot")
					    .append("svg")
						.attr("width", "800")
						.attr("height", "500")
						.attr("class","linePlotClass"),
			
		height = linePlotSvg.attr("height"),
		width = linePlotSvg.attr("width"),
		padding = 80,
		xScale = d3.scale.linear().domain([1990, 2015]).range([padding, width-padding]),
		yScale = d3.scale.linear().domain([0, 100]).range([height - padding, padding]),
		xAxis = d3.svg.axis()
					  .scale(xScale)
					  .orient("bottom")
					  .ticks(5)
					  .tickFormat(d3.format("d")),
		yAxis = d3.svg.axis().scale(yScale).orient("left"),
		line = d3.svg.line()
			         .x(function (d) { return xScale(d.Time); })
			         .y(function (d) { return yScale(d.Value); }),
		dict = {};

	/* Draw the axes*/
	linePlotSvg.append("g").attr("transform", "translate(0," + (height - padding) + ")").attr("class", "axis")
	.call(xAxis);
	linePlotSvg.append("g").attr("transform", "translate(" + padding + ", 0" + ")").attr("class", "axis")
	.call(yAxis);

	d3.json("datasets/worldData.json", function (error, entireJSONData) {
		if(error) {
			console.log("error in json");
		}
		var rows = entireJSONData.data; 
		/* Read from CSV file and store into dictionary object, with keys as Country name and values as an array of objects of time and internet penetration value.
			dict = {
				"China" : [{
							"Time" : 2014,
							"Value" : 20
						  },
						  {
							"Time" : 2013,
							"Value" : 17
						  },
						  ...],
				"United States" : [{
									"Time" : 2014,
									"Value" : 89
								   },
								   {
									"Time" : 2013,
									"Value" : 77
								   },
								   ....],
			 	...
			}
		*/
		rows.forEach(function(country) {
				if(!dict[country.location]) {
					dict[country.location] = [];
				}
				currentRowDict = {}
				if(country.Value == null)
					currentRowDict.Value = 0;
				else
					currentRowDict.Value = country.Value;
				if(Number(country.Time.substring(0,4)) >= 1990) {
					currentRowDict.Time = Number(country.Time.substring(0,4));
					dict[country.location].push(currentRowDict);
				}	
		});
		var countries = ["United States","China","India","Mexico","Libya"];
		var colors = ["red","blue","green","purple","black"];
	/* Drawing the lines, text and graph key for each country*/
	for(var i=1; i<=countries.length; i++) {
		linePlotSvg.append("circle")
						 .attr("cx", 130*i)
						 .attr("cy", 470)
						 .attr("r",6)
						 .style("fill", colors[i-1])
		linePlotSvg.append("text")
						 .attr("x", (130*i)+10)
						 .attr("y", 474)
						 .text(countries[i-1])
		linePlotSvg.append("path").attr("d", line(dict[countries[i-1]]))
											.attr("class", "outline")
											.style("stroke", colors[i-1]);
	}
	/*Drawing the Y-axis label*/
	linePlotSvg.append("text")
	            .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
	            .attr("transform", "translate("+ (padding/2) +","+(height/2)+")rotate(-90)")  // text is drawn off the screen top left, move down and out and rotate
	            .text("Internet penetration per 100 people");
	});
})();
