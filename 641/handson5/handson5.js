let width = 150;
let height = 150;
let margin_x = 20;
let margin_y = 20;

function produceAndPositionScatterPlot(data1, data2, field1, field2) {
	console.log("Producing and positioning " + field1 + " x " + field2);

	let corr_coef = ss.sampleCorrelation(data1, data2);
	let p_value = getPforR(corr_coef, data1.length);

	console.log("Correlation is r=" + corr_coef);
	console.log("P-value is p=" + p_value);

	let container_id = "#";
	if (p_value < 0.01) {
		container_id += "significant";
	}
	else {
		container_id += "insignificant";
	}
	let svg = d3.select(container_id).append("svg")
		.attr("width", width + 2*margin_x)
		.attr("height", height + 2*margin_y);

	let vis = new ScatterplotVis(svg);
	vis.render(data1, data2, field1, field2);
}

class ScatterplotVis {
	constructor(svg_elem) {
		this.svg = svg_elem;
	}

	render(data1, data2, field1, field2) {

		// Create a group to set the local coordinate system
		let group = this.svg.append("g")
			.attr("transform", "translate("+margin_x+","+margin_y+")");

		// Define scales
		let x = d3.scaleLinear()
			.domain([ss.min(data1), ss.max(data1)])
			.range([0, width]);

		let y = d3.scaleLinear()
			.domain([ss.min(data2), ss.max(data2)])
			.range([height, 0]);

		// Add a background rectangle
		group.append("rect")
			.attr("class", "plotbg")
			.attr("x", 0)
			.attr("y", 0)
			.attr("width", width)
			.attr("height", height);

		// Add quantiles
		group.append("rect")
			.attr("class", "quantile")
			.attr("x", 0)
			.attr("y", y(ss.quantile(data2, 0.75)))
			.attr("height", y(ss.quantile(data2, 0.25)) - y(ss.quantile(data2, 0.75)))
			.attr("width", width);

		group.append("rect")
			.attr("class", "quantile")
			.attr("x", x(ss.quantile(data1, 0.25)))
			.attr("y", 0)
			.attr("height", height)
			.attr("width", x(ss.quantile(data1, 0.75)) - x(ss.quantile(data1, 0.25)));

		// Add dots to scatterplot
		let zipped_data = d3.zip(data1, data2);
		let data_join = group.selectAll(".dot").data(zipped_data);

		data_join.enter().append("circle")
			.attr("class", "dot")
			.attr("cx", function(d) { return x(d[0]); })
			.attr("cy", function(d) { return y(d[1]); })
			.attr("r", 2);

		// Calculate linear regression.
		let regression = ss.linearRegression(zipped_data);
		let model = ss.linearRegressionLine(regression);
		let r_squared = ss.rSquared(zipped_data, model);
		console.log("R2 is " + r_squared);

		// Add text for the R2 value.
		group.append("text")
			.attr("class", "label")
			.attr("x",0)
			.attr("y",-3)
			.text("R2: " + r_squared.toFixed(2));

		// Add the y axis labels.
		group.append("text")
			.attr("class", "label")
			.attr("x",0)
			.attr("y",3)
			.attr("dominant-baseline", "hanging")
			.attr("transform", "rotate(90,0,0)")
			.text(ss.max(data2).toFixed(1));

		group.append("text")
			.attr("class", "label")
			.attr("x",width)
			.attr("y",3)
			.attr("dominant-baseline", "hanging")
			.attr("text-anchor", "end")
			.attr("transform", "rotate(90,0,0)")
			.text(ss.min(data2).toFixed(1));

		group.append("text")
			.attr("class", "label")
			.attr("x",width/2)
			.attr("y",3)
			.attr("dominant-baseline", "hanging")
			.attr("text-anchor", "middle")
			.attr("transform", "rotate(90,0,0)")
			.text(field2);

		// Finally, the x axis labels.
		group.append("text")
			.attr("class", "label")
			.attr("x",0)
			.attr("y", height + 3)
			.attr("dominant-baseline", "hanging")
			.text(ss.max(data2).toFixed(1));

		group.append("text")
			.attr("class", "label")
			.attr("x",width)
			.attr("y", height + 3)
			.attr("dominant-baseline", "hanging")
			.attr("text-anchor", "end")
			.text(ss.min(data2).toFixed(1));

		group.append("text")
			.attr("class", "label")
			.attr("x",width/2)
			.attr("y", height + 3)
			.attr("dominant-baseline", "hanging")
			.attr("text-anchor", "middle")
			.text(field2);
	}
}
