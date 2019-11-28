// This function visualizes the transformed data
// Based on example from https://bl.ocks.org/alokkshukla/3d6be4be0ef9f6977ec6718b2916d168

import { scaleOrdinal, pack, select, selectAll, schemeCategory10, hierarchy } from "d3";
import { getCurrentTarget } from "./getCurrentTarget.js";

function createChart(data, id) {
	// To make a bubblechart the data needs to be nested into a parent object.
	const root = {
		children: data
	}

	// Scale the svg dimensions based on the width and height of the browser
	const height = window.innerHeight / 2.2;
	const width = window.innerWidth / 2.2;

	// Use a color scheme from D3
	const color = scaleOrdinal(schemeCategory10);

	// This packs the bubble
	const bubble = pack(root)
		.size([width, height])
		.padding(10);

	const colors = {
		"Bijl": "#1f77b4",
		"Boog": "#ff7f0e",
		"Dolk": "#9467bd",
		"Knots": "#bcbd22",
		"Lans": "#e377c2",
		"Mes": "#7f7f7f",
		"Piek": "#17becf",
		"Strijdzeis": "#8c564b",
		"Vechtketting": "#d62728",
		"Zwaard": "#2ca02c"
	}



data.sort((a, b) => a.key.localeCompare(b.key));

	// This adds a svg element and determines the size of the svg and adds the class: bubble
	const currentChart = select(`#${id}`);

	const svg = currentChart.select(".bubble");

	// this selects all the nodes and puts it in an array
	const nodes = hierarchy(root)
		.sum(d => d.amount);
	// This counts the total amount of weapons of the selected region
	const nodeTotal = nodes.data.children.reduce((node, currentValue) => node + currentValue.amount, 0);

	// Select the div with the class: table from the currentChart
	const table = currentChart.select(".table")
		.selectAll(".table-row")
		.data(data)

		table.join(
			//enter selection
			enter => {
				// This creates a div with the class table-row
				const tableEnter = enter.append("div")
					.attr("class", "table-row")

				// This creates a div inside the table-row which contains the color of the element.
				tableEnter.append("div")
					.attr("class", "legend-color")
					.style("background-color", d => colors[d.key])
				// This adds a div inside the table-row which contains the weapon type
				tableEnter.append("div")
					.attr("class", "legend-type")
					.append("p")
					.text(d => d.key)
				// This adds a div inside the table-row which contains the amount of a certain weapon type in the database
				tableEnter.append("div")
					.attr("class", "legend-amount")
					.append("p")
					.text(d => Math.round(d.amount / nodeTotal * 1000) / 10 + "%")
				},
			// update selection
			update => {
				// This selects the table-row
				update.select("table-row")
				// This selects the div which contains the color
				update.select(".legend-color")
					.style("background-color", d => colors[d.key])
				// This selects the div which contains the weapon type
				update.select(".legend-type")
					.select("p")
					.text(d => d.key)
				// this selects the div which contains the amount of a certain weapon type in the database
				update.select(".legend-amount")
					.select("p")
					.text(d => Math.round(d.amount / nodeTotal * 1000) / 10 + "%");
			}
		)

	// this selects all of the individual nodes, adds a "g" element to all the nodes and adds a class as well

	let node = svg.selectAll(".node")
		.data(bubble(nodes).descendants()
		.filter(function(d){
					return !d.children;
		}))

	node.join(
		// enter selection
		enter => {
			// This appends a g element to the svg and adds the class node to the g element and determines the position of the circle
			const nodeEnter = enter.append("g")
			.attr("class", "node")
			.attr("transform", function(d) {
				return "translate(" + d.x + "," + d.y + ")";
			})
			// This appends a title to the svg
			nodeEnter.append("title")
				.text(function(d) {
					return d.data.key + ": " + Math.round(d.data.amount / nodeTotal * 1000) / 10+ "%";
				})
			// This appends a circle to the svg and adds attributes to determine the size and of the circle
			nodeEnter.append("circle")
				.attr("r", function(d) {
					return d.r;
				})
				.style("fill", function(d,i) {
					return colors[d.data.key]
				});
			// This appends text to the svg which consists of the weapon type and scales this text based on the size of the circle
			nodeEnter.append("text")
				.attr("dy", ".2em")
				.style("text-anchor", "middle")
				.text(function(d) {
					return d.data.key.substring(0, d.r / 1);
				})
				.attr("font-family", "sans-serif")
				.attr("font-size", function(d){
					return d.r/3;
				})
				.attr("fill", "white")
			},
			// update selection
		update => {
			// This adds a transition to the bubbles and determines the position of the circles
			update.transition().duration(300)
			.attr("transform", function(d) {
				return "translate(" + d.x + "," + d.y + ")";
			})
			// This selects the title which consists of the weapon type and amount of weapon types
			update.select("title")
				.text(function(d) {
					return d.data.key + ": " + Math.round(d.data.amount / nodeTotal * 1000) / 10 + "%";
				})
			// This selects the circle and determines the size and color of the circle
			update.select("circle")
				.attr("r", function(d) {
					return d.r;
				})
				.style("fill", function(d,i) {
					return colors[d.data.key]
				});

			// This selects the text element which consists of the weapon type and scales this text based on the size of the circle
			update.select("text")
				.attr("dy", ".2em")
				.style("text-anchor", "middle")
				.text(function(d) {
					return d.data.key.substring(0, d.r / 1);
				})
				.attr("font-family", "sans-serif")
				.attr("font-size", function(d){
					return d.r/3;
				})
				.attr("fill", "white")
		}
	)

	select(self.frameElement)
		.style("height", height + "px");
}

export { createChart }
