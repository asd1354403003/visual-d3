class PovertyRateVis {

    constructor(svg_id) {
        this.url = "https://ils.unc.edu/~gotz/courses/data/states.csv";
        this.svg_id = svg_id;

        // Load the data and process it as needed.
        this.loadAndPrepare();
    }

    render(regions, avgs, min_pr, max_pr) {
        let plot_spacing = 30;
        let plot_width = 150;

        // Get the svg element to draw on
        let svg = d3.select("#"+this.svg_id);

        // Y axis scale
        let y = d3.scaleLinear()
            .domain([min_pr, max_pr])
            .range([plot_width, 0]);

        // Add group SVG elements, one for each region's chart.
        let region_groups = svg.selectAll(".region_g")
            .data(regions.entries())
            .enter().append("g")
            .attr("class", "region_g")
            .attr("transform", function(d,i) {
                let x = plot_spacing + i*(plot_width+plot_spacing);
                let y = plot_spacing;
                return "translate("+x+","+y+")";
            });

        // Attach a gray rectangle to each group as the background of the chart.
        region_groups.append("rect")
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", plot_width)
            .attr("height", plot_width)
            .on("mousemove", function(event, d) {
                let mouse_coords = d3.pointer(event);

                svg.selectAll(".highlightline")
                    .attr("y1", mouse_coords[1])
                    .attr("y2", mouse_coords[1]);
            })
            .on("mouseout", function(event, d) {
                svg.selectAll(".highlightline")
                    .attr("y1", -100)
                    .attr("y2", -100);
            })
            .style("fill", "#f4f4f4");

        // Add labels
        region_groups.append("text")
            .attr("class", "label")
            .attr("x", -2)
            .attr("y", 0)
            .attr("text-anchor", "end")
            .attr("dominant-baseline", "middle")
            .text(max_pr);

        region_groups.append("text")
            .attr("class", "label")
            .attr("x", -2)
            .attr("y", plot_width)
            .attr("text-anchor", "end")
            .attr("dominant-baseline", "middle")
            .text(min_pr);

        region_groups.append("text")
            .attr("class", "label")
            .attr("x", plot_width/2)
            .attr("y", plot_width+3)
            .attr("text-anchor", "middle")
            .attr("dominant-baseline", "hanging")
            .text(function(d) { return d[0];});

        // Draw highlight line.
        region_groups.append("line")
            .attr("class", "highlightline")
            .attr("x1", 0)
            .attr("x2", plot_width)
            .attr("y1", -100)
            .attr("y2", -100)
            .style("stroke", "gold")
            .style("stroke-width", 4);

        // Draw the average line.
        region_groups.append("line")
            .attr("x1", 0)
            .attr("x2", plot_width)
            .attr("y1", function(d) {
                let region_name = d[0];
                let pr_mean = avgs.get(region_name).poverty_rate;
                return y(pr_mean);
            })
            .attr("y2", function(d) {
                let region_name = d[0];
                let pr_mean = avgs.get(region_name).poverty_rate;
                return y(pr_mean);
            })
            .style("stroke", "red");

        region_groups.append("text")
            .attr("class", "avglabel")
            .attr("x", 0)
            .attr("y", function(d) {
                let region_name = d[0];
                let pr_mean = avgs.get(region_name).poverty_rate;
                return y(pr_mean);
            })
            .style("fill", "red")
            .attr("text-anchor", "end")
            .attr("dominant-baseline", "middle")
            .text(function(d) {
                return Math.round(avgs.get(d[0]).poverty_rate);
            });

        // Draw the state lines.
        region_groups.selectAll(".stateline").data(function(d) { return d[1]; })
            .enter().append("line")
            .attr("class", "stateline")
            .attr("x1", 0)
            .attr("x2", plot_width)
            .attr("y1", function(d) { return y(d.poverty_rate);})
            .attr("y2", function(d) { return y(d.poverty_rate);})
            .style("stroke", "lightblue");

        console.log("Draw the vis!");
    }

    loadAndPrepare() {
        let thisvis = this;

        // Load the data from CSV
        d3.csv(this.url, function(d) {
            return {
                // Convert text values to other types as needed.
                state: d.state,
                life_expectancy: +d.life_expectancy,
                poverty_rate: +d.poverty_rate,
                region: d.region
            }
        }).then(function(data) {
            // Calculate min and max poverty rates
            let min_pr = d3.min(data, function(d) { return d.poverty_rate;});
            let max_pr = d3.max(data, function(d) { return d.poverty_rate;});

            // Group the data by region.
            let grouped_data = d3.group(data,function(d) {return d.region;});

            // Calculate averages by region
            let avg_data = d3.rollup(data,
                function(region_of_states) {
                    let pr_mean = d3.mean(region_of_states, function(d) {return d.poverty_rate;});
                    let le_mean = d3.mean(region_of_states, function(d) {return d.life_expectancy;});

                    return {
                        poverty_rate: pr_mean,
                        life_expectancy: le_mean,
                        states: region_of_states
                    }
                },
                function(d) {
                    return d.region;
                });

            thisvis.render(grouped_data, avg_data, min_pr, max_pr);
        }).catch(function(error) {
            console.log("Error loading CSV data.");
            console.log(error);
        });
    }
}
