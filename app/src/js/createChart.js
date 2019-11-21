// This function visualizes the transformed data
// Based on example from https://bl.ocks.org/alokkshukla/3d6be4be0ef9f6977ec6718b2916d168

import { scaleOrdinal, pack, select, selectAll, schemeCategory10, hierarchy } from "d3";

function createChart(data) {
	console.log(data);
	// To make a bubblechart the data needs to be nested into a parent object.
	const dataset = {
		children: data
	}

	// Scale the svg dimensions based on the width and height of the browser
	const height = window.innerHeight / 2.2;
	const width = window.innerWidth / 2.2;

	// Use a color scheme from D3
	const color = scaleOrdinal(schemeCategory10);

	// This packs the bubble
	const bubble = pack(dataset)
		.size([width, height])
		.padding(10);

	// This adds a svg element and determines the size of the svg and adds the class: bubble
	const svg = select("#chart1")
		.select(".bubble");

	// this selects all the nodes and puts it in an array
	const nodes = hierarchy(dataset)
		.sum(d => d.amount);

	// this selects all of the individual nodes, adds a "g" element to all the nodes and adds a class as well

	const node = svg.selectAll(".node")
		.data(bubble(nodes).descendants())
		.attr('r', 0);

	const nodeEnter = node.enter()
		.filter(function(d){
			return !d.children;
		})
		.merge(node)
		.append("g")
		.attr("class", "node")
		.attr("transform", function(d) {
			return "translate(" + d.x + "," + d.y + ")";
		});
	// This adds a title to every individual bubble
	nodeEnter.append("title")
		.text(function(d) {
			return d.data.key + ": " + d.data.amount;
		});

	// this nests the bubble contents into a container. I did this so i could add transitions to my entire bubble
	nodeEnter.append("g")
		.attr("class", "bubble-container")
		.append("circle")
		.attr("r", function(d) {
			return d.r;
		})
		.style("fill", function(d,i) {
			return color(i);
		});
	// This selects the container of an individual bubble and adds the text of the weapon type to it.
	nodeEnter.select(".bubble-container")
		.append("text")
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

		node.merge(nodeEnter).exit().remove()

	// This is a click function that when clicked displays the weapon type and value of the clicked bubble
	// Based on example from https://observablehq.com/@johnhaldeman/tutorial-on-d3-basics-and-circle-packing-heirarchical-bubb
	const selectBubble = d => {

		const { data } = d;

		const currentBubble = select(this);

		if(currentBubble !== this){
			svg.selectAll("#details-popup").remove();
		}

		const textblock = svg.selectAll("#details-popup")
			.data([d])
			.enter()
			.append("g")
			.attr("id", "details-popup")
			.attr("font-size", 14)
			.attr("font-family", "sans-serif")
			.attr("text-anchor", "start")
			.attr("transform", data => `translate(0, 20)`);

		textblock.append("text")
			.text(data.key + ": " + data.amount)
			.attr("y", "16")

	}
	nodeEnter.on("click", selectBubble);

	select(self.frameElement)
		.style("height", height + "px");
}

export { createChart }
