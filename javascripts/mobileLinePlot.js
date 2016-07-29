(function(){
	var mobileLinePlotSvg = d3.select("#mobileLinePlot")
							  .append("svg")
							  .attr("width", "800")
							  .attr("height", "500")
							  .attr("class","linePlotClass"),	
		height = mobileLinePlotSvg.attr("height"),
		width = mobileLinePlotSvg.attr("width"),
		padding = 80;
		xScale = d3.scale.linear().domain([1990, 2015]).range([padding, width-padding]),
		yScale = d3.scale.linear().domain([0, 170]).range([height - padding, padding]),
		xAxis = d3.svg.axis().scale(xScale)
							 .orient("bottom")
							 .ticks(5).tickFormat(d3.format("d")),
		yAxis = d3.svg.axis().scale(yScale).orient("left"),
		line = d3.svg.line()
				 .x(function (d) { return xScale(d.Time); })
				 .y(function (d) { return yScale(d.Value); }),
		dict = {};
	/* Draw the axes*/
	mobileLinePlotSvg.append("g")
					 .attr("transform", "translate(0," + (height - padding) + ")")
					 .attr("class", "axis")
					 .call(xAxis);
	mobileLinePlotSvg.append("g")
					 .attr("transform", "translate(" + padding + ", 0" + ")")
					 .attr("class", "axis")
					 .call(yAxis);

	d3.csv("datasets/mobile.csv", function (error, entireCSVData) {
		if(error) {
			console.log("error in cs");
		}
		var rows = entireCSVData; 	
		dict={};
		/* Read from CSV file and store into dictionary object, with keys as Country name and values as an array of objects of time and mobile subscription value.
			dict = {
				"China" : [{
							"Time" : 2014,
							"Value" : 67
						  },
						  {
							"Time" : 2013,
							"Value" : 43
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
		rows.forEach(function(country){
			countryArray = [];
			for(key in country) {
				countryDict = {};
				if(!isNaN(Number(key.substring(0,4)))) {
					countryDict.Time = Number(key.substring(0,4));
					countryDict.Value = country[key]
					countryArray.push(countryDict);
				}
			}
			dict[country["Country Name"]] = countryArray;
		});
		var countries = ["United States","China","India","Mexico","Libya"];
		var colors = ["red","blue","green","purple","black"];
	/* Drawing the lines, text and graph key for each country*/
	for(var i=1; i<=countries.length; i++) {
		mobileLinePlotSvg.append("circle")
						 .attr("cx", 130*i)
						 .attr("cy", 470)
						 .attr("r",6)
						 .style("fill", colors[i-1])
		mobileLinePlotSvg.append("text")
						 .attr("x", (130*i)+10)
						 .attr("y", 474)
						 .text(countries[i-1])
		mobileLinePlotSvg.append("path").attr("d", line(dict[countries[i-1]]))
										.attr("class", "outline")
										.style("stroke", colors[i-1])
										.style("stroke-dasharray", ("3, 3"));
	}
	/*Drawing the Y-axis label*/
	mobileLinePlotSvg.append("text")
	            .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
	            .attr("transform", "translate("+ (padding/2) +","+(height/2)+")rotate(-90)")  // text is drawn off the screen top left, move down and out and rotate
	            .text("Mobile subscription per 100 people");


	});
})();



