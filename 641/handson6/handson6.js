class StateScatterplot {

    constructor(container_id) {
        // Initialize the dataset.
        this.data = new StateData();

        // This variable is used to define size of the visualization canvas and the
        // margin (or "padding") around the scattter plot.  We use the margin to draw
        // things like axis labels.
        let height = 500;
        let width = 500;
        let margin = 40;

        // Define a variety of scales, for color, x axis and y axis.  We store these as attributes of the StateScatterplot
        // so we can reuse them in the render method.

        // Poverty rates are all below 30 percent.
        this.x = d3.scaleLinear()
            .domain([0,30])
            .range([margin,width-margin]);

        // Life expectancy values all fall between 70 and 90.
        this.y = d3.scaleLinear()
            .domain([90,70])
            .range([margin,height-margin]);

        // Define a color scale.
        this.region_color = d3.scaleOrdinal(d3.schemeCategory10);

        // Create the SVG canvas that will be used to render the visualization.
        this.svg = d3.select("#vis_container")
            .append("svg")
            .attr("width", width)
            .attr("height", height);

        // Add axes.  First the X axis and label.
        this.svg.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(0,"+(500-margin)+")")
            .call(d3.axisBottom(this.x));

        this.svg.append("text")
            .attr("class", "axis-label")
            .attr("y", 495)
            .attr("x",0 + (500 / 2))
            .style("text-anchor", "middle")
            .text("Poverty Rate");

        // Now the Y axis and label.
        this.svg.append("g")
            .attr("class", "axis")
            .attr("transform", "translate("+margin+",0)")
            .call(d3.axisLeft(this.y));

        this.svg.append("text")
            .attr("transform", "rotate(90)")
            .attr("class", "axis-label")
            .attr("y", -5)
            .attr("x",0 + (500 / 2))
            .style("text-anchor", "middle")
            .text("Life Expectancy");

        // Draw the baseline circles for the training set.
        let circles = this.svg.selectAll(".baseline").data(this.data.training_data, function(d) {return d.state;});

        // Create local variables for the scales to allow them to be used inside anonymous functions (where 'this' has
        // a different value than desired).
        let x = this.x;
        let y = this.y;
        let region_color = this.region_color;

        circles.enter().append("circle")
            .attr("class", "baseline")
            .attr("r", 4)
            .attr("cx", function(d) { return x(d.poverty_rate); })
            .attr("cy", function(d) { return y(d.life_expectancy); })
            .style("stroke", function(d) { return region_color(d.region); })
            .style("fill", function(d) { return region_color(d.region); })
            .style("fill-opacity", "0.1")
            .style("stroke-width", 1)
            .style("stroke-opacity", "0.2")
            .on("mouseover", function(event, d) { document.getElementById("details").innerHTML = d.state + " has a life expectancy of " + d.life_expectancy + " and a poverty rate of " + d.poverty_rate + "%."; })
            .on("mouseout", function(event, d) { document.getElementById("details").innerHTML = "&nbsp;"; });
    }

    // Next, we define the render method.  This is used when the page first loads
    // to draw data for the entire US.  It is also called whenever the select control
    // is changed (e.g., to show only the South or only the Northeast).
    render(_subset) {
        // Create local variables for the scales to allow them to be used inside anonymous functions (where 'this' has
        // a different value than desired).
        let x = this.x;
        let y = this.y;
        let region_color = this.region_color;

        // Filter the data and do a data join with the circles.  By default we use all test data ("us" mode).
        let data_subset = this.data.test_data;
        // However, if none is selected, show nothing.
        if (_subset == "none") {
            data_subset = [];
        }
        // Finally, if subset is specified as a region, apply the filter.
        else if (_subset != "us") {
            data_subset = this.data.test_data.filter(function(d) {return (d.label == _subset); });
        }

        let circles = this.svg.selectAll(".label").data(data_subset, function(d) {return d.state;});

        circles.exit()
            .transition()
            .duration(250)
            .attr("r",0)
            .remove();

        circles.enter().append("circle")
            .attr("class", "label")
            .attr("r", 0)
            .attr("cx", function(d) { return x(d.poverty_rate); })
            .attr("cy", function(d) { return y(d.life_expectancy); })
            .style("fill", function(d) { return region_color(d.label); })
            .on("mouseover", function(event, d){ document.getElementById("details").innerHTML = d.state + " has a life expectancy of " + d.life_expectancy + " and a poverty rate of " + d.poverty_rate + "%."; })
            .on("mouseout", function(event, d){ document.getElementById("details").innerHTML = "&nbsp;"; })
            .transition()
            .duration(750)
            .attr("r",5)
    }
}

class StateData {
    // Life expectancy, poverty rate, and region for all 50 United States.  Data
    // is also provided for the District of Columbia.  We therefore have 51 items
    // in the data array.
    constructor() {
        // Hard coded copy of all of the data.
        this.full_data = [
            {state: "Alabama", life_expectancy: 75.4, poverty_rate: 22, region: "South"},
            {state: "Alaska", life_expectancy: 78.3, poverty_rate: 21, region: "Other"},
            {state: "Arizona", life_expectancy: 79.6, poverty_rate: 23, region: "West"},
            {state: "Arkansas", life_expectancy: 76, poverty_rate: 22, region: "South"},
            {state: "California", life_expectancy: 80.8, poverty_rate: 24, region: "West"},
            {state: "Colorado", life_expectancy: 80, poverty_rate: 16, region: "West"},
            {state: "Connecticut", life_expectancy: 80.8, poverty_rate: 14, region: "Northeast"},
            {state: "Delaware", life_expectancy: 78.4, poverty_rate: 17, region: "Northeast"},
            {state: "District of Columbia", life_expectancy: 76.5, poverty_rate: 25, region: "South"},
            {state: "Florida", life_expectancy: 79.4, poverty_rate: 20, region: "South"},
            {state: "Georgia", life_expectancy: 77.2, poverty_rate: 23, region: "South"},
            {state: "Hawaii", life_expectancy: 81.3, poverty_rate: 24, region: "Other"},
            {state: "Idaho", life_expectancy: 79.5, poverty_rate: 19, region: "West"},
            {state: "Illinois", life_expectancy: 79, poverty_rate: 19, region: "Midwest"},
            {state: "Indiana", life_expectancy: 77.6, poverty_rate: 20, region: "Midwest"},
            {state: "Iowa", life_expectancy: 79.7, poverty_rate: 14, region: "Midwest"},
            {state: "Kansas", life_expectancy: 78.7, poverty_rate: 17, region: "Midwest"},
            {state: "Kentucky", life_expectancy: 76, poverty_rate: 22, region: "South"},
            {state: "Louisiana", life_expectancy: 75.7, poverty_rate: 27, region: "South"},
            {state: "Maine", life_expectancy: 79.2, poverty_rate: 16, region: "Northeast"},
            {state: "Maryland", life_expectancy: 78.8, poverty_rate: 16, region: "Northeast"},
            {state: "Massachusetts", life_expectancy: 80.5, poverty_rate: 15, region: "Northeast"},
            {state: "Michigan", life_expectancy: 78.2, poverty_rate: 20, region: "Midwest"},
            {state: "Minnesota", life_expectancy: 81.1, poverty_rate: 13, region: "Midwest"},
            {state: "Mississippi", life_expectancy: 75, poverty_rate: 25, region: "South"},
            {state: "Missouri", life_expectancy: 77.5, poverty_rate: 19, region: "Midwest"},
            {state: "Montana", life_expectancy: 78.5, poverty_rate: 19, region: "West"},
            {state: "Nebraska", life_expectancy: 79.8, poverty_rate: 14, region: "Midwest"},
            {state: "Nevada", life_expectancy: 78.1, poverty_rate: 21, region: "West"},
            {state: "New Hampshire", life_expectancy: 80.3, poverty_rate: 10, region: "Northeast"},
            {state: "New Jersey", life_expectancy: 80.3, poverty_rate: 17, region: "Northeast"},
            {state: "New Mexico", life_expectancy: 78.4, poverty_rate: 27, region: "West"},
            {state: "New York", life_expectancy: 80.5, poverty_rate: 22, region: "Northeast"},
            {state: "North Carolina", life_expectancy: 77.8, poverty_rate: 21, region: "South"},
            {state: "North Dakota", life_expectancy: 79.5, poverty_rate: 14, region: "Midwest"},
            {state: "Ohio", life_expectancy: 77.8, poverty_rate: 20, region: "Midwest"},
            {state: "Oklahoma", life_expectancy: 75.9, poverty_rate: 19, region: "South"},
            {state: "Oregon", life_expectancy: 79.5, poverty_rate: 19, region: "West"},
            {state: "Pennsylvania", life_expectancy: 78.5, poverty_rate: 17, region: "Northeast"},
            {state: "Rhode Island", life_expectancy: 79.9, poverty_rate: 18, region: "Northeast"},
            {state: "South Carolina", life_expectancy: 77, poverty_rate: 24, region: "South"},
            {state: "South Dakota", life_expectancy: 79.5, poverty_rate: 17, region: "Midwest"},
            {state: "Tennessee", life_expectancy: 76.3, poverty_rate: 21, region: "South"},
            {state: "Texas", life_expectancy: 78.5, poverty_rate: 23, region: "South"},
            {state: "Utah", life_expectancy: 80.2, poverty_rate: 16, region: "West"},
            {state: "Vermont", life_expectancy: 80.5, poverty_rate: 14, region: "Northeast"},
            {state: "Virginia", life_expectancy: 79, poverty_rate: 16, region: "South"},
            {state: "Washington", life_expectancy: 79.9, poverty_rate: 16, region: "West"},
            {state: "West Virginia", life_expectancy: 75.4, poverty_rate: 21, region: "South"},
            {state: "Wisconsin", life_expectancy: 80, poverty_rate: 15, region: "Midwest"},
            {state: "Wyoming", life_expectancy: 78.3, poverty_rate: 14, region: "West"}
        ];

        /////////////////////////////////////////////////////////
        /////////////////////////////////////////////////////////
        // THIS IS WHERE WE'LL ADD OUR LOGIC TO PROCESS THE DATA, TRAIN A CLASSIFIER, AND USE IT TO CLASSIFY STATES.
        /////////////////////////////////////////////////////////
        /////////////////////////////////////////////////////////

        // Add high/med/low categories for PR and LE.
        let life_expectancy = this.full_data.map(function(d) {
            return d.life_expectancy;
        });
        let poverty_rate = this.full_data.map(function(d) {
            return d.poverty_rate;
        });
        // Determine low/med/high labels
        this.full_data.forEach(function(d) {
            if (d.life_expectancy > ss.quantile(life_expectancy, 0.67)) {
                d.life_expectancy_cat = "high";
            }
            else if (d.life_expectancy < ss.quantile(life_expectancy, 0.33)) {
                d.life_expectancy_cat = "low";
            }
            else {
                d.life_expectancy_cat = "med";
            }

            // Now repeat, but for poverty rate.
            if (d.poverty_rate > ss.quantile(poverty_rate, 0.67)) {
                d.poverty_rate_cat = "high";
            }
            else if (d.poverty_rate < ss.quantile(poverty_rate, 0.33)) {
                d.poverty_rate_cat = "low";
            }
            else {
                d.poverty_rate_cat = "med";
            }
        });


        // Define the training set and test sets.  Training will be done on Northeast and South states.
        this.training_data = this.full_data.filter(function(d) {
            return ((d.region == "Northeast") || (d.region == "South"));
        });
        this.test_data = this.full_data.filter(function(d) {
            return ((d.region != "Northeast") && (d.region != "South"));
        });

        // Create the classifier and train it with all items in the training set.
        let classifier = new ss.bayesian();
        this.training_data.forEach(function(d) {
            classifier.train({
                    poverty_rate: d.poverty_rate_cat,
                    life_expectancy: d.life_expectancy_cat
                },
                d.region);
        });

        // Use the classifier to label each item in the test set. Because only two regions are
        // included in the training set (Northeast and South), the probability vector produced
        // by the classifier will contain two values: one for Northeast; one for South.
        this.test_data.forEach(function(d) {
                let prob_vec = classifier.score({
                    poverty_rate: d.poverty_rate_cat,
                    life_expectancy: d.life_expectancy_cat
                });
                console.log(d.state);
                console.log(prob_vec);
            }
        );
    }
}