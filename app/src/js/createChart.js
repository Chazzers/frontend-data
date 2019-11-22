// This function visualizes the transformed data
// Based on example from https://bl.ocks.org/alokkshukla/3d6be4be0ef9f6977ec6718b2916d168

import { scaleOrdinal, pack, select, selectAll, schemeCategory10, hierarchy } from "d3";
import { getCurrentTarget } from "./getCurrentTarget.js"

function createChart(data) {
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

	const getCurrentTargetId = document.querySelectorAll(".chart").forEach(select => {
		select.addEventListener("change", getCurrentTarget)
		return getCurrentTarget;
	})
	console.log(getCurrentTargetId);
	// .forEach(chart => chart.addEventListener("change", getCurrentTarget))

	// This adds a svg element and determines the size of the svg and adds the class: bubble
	const svg = select(`#chart1`)
		.select(".bubble");

	// this selects all the nodes and puts it in an array
	const nodes = hierarchy(root)
		.sum(d => d.amount);

	// this selects all of the individual nodes, adds a "g" element to all the nodes and adds a class as well

	let node = svg.selectAll(".node")
		.data(bubble(nodes).descendants()
		.filter(function(d){
					return !d.children;
		}))

	node.join(
		enter => {
			const nodeEnter = enter.append("g")
			.attr("class", "node")
			.attr("transform", function(d) {
				return "translate(" + d.x + "," + d.y + ")";
			})
			nodeEnter.append("title")
				.text(function(d) {
					return d.data.key + ": " + d.data.amount;
				})
			nodeEnter.append("circle")
				.attr("r", function(d) {
					return d.r;
				})
				.style("fill", function(d,i) {
					return color(i);
				});
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
			},
		update => {
			console.log(update);
			update.transition().duration(300)
			.attr("transform", function(d) {
				return "translate(" + d.x + "," + d.y + ")";
			})
			update.select("title")
				.text(function(d) {
					return d.data.key + ": " + d.data.amount;
				})
			update.select("circle")
				.attr("r", function(d) {
					return d.r;
				})
				.style("fill", function(d,i) {
					return color(i);
				});
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

	// This is a click function that when clicked displays the weapon type and value of the clicked bubble
	// Based on example from https://observablehq.com/@johnhaldeman/tutorial-on-d3-basics-and-circle-packing-heirarchical-bubb

	select(self.frameElement)
		.style("height", height + "px");
}

export { createChart }
