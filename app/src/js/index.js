import { json, nest, create, select, selectAll, pack, scaleOrdinal, schemeCategory10, hierarchy } from 'd3';
import "../styles/main.scss"

// Url of api endpoint
const url =
	"https://api.data.netwerkdigitaalerfgoed.nl/datasets/ivo/NMVW/services/NMVW-32/sparql";

// SPARQL query to get preferred weapon types from Japan out of the NMVW collection
const query = `
PREFIX dct: <http://purl.org/dc/terms/>
PREFIX dc: <http://purl.org/dc/elements/1.1/>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
PREFIX edm: <http://www.europeana.eu/schemas/edm/>
PREFIX foaf: <http://xmlns.com/foaf/0.1/>

SELECT ?cho ?placeName ?title ?type WHERE {
 <https://hdl.handle.net/20.500.11840/termmaster6917> skos:narrower* ?place .
 ?place skos:prefLabel ?placeName .

 VALUES ?type { "zwaard" "Zwaard" "boog" "Boog" "lans" "Lans" "mes" "knots" "Piek" "vechtketting" "dolk" "bijl" "strijdzeis" }


  ?cho 	dct:spatial ?place ;
        dc:title ?title ;
        dc:type ?type .
		FILTER langMatches(lang(?title), "ned") .
}
`;

// This takes the endpoint and adds the query to it
const connectionString =
	url + "?query=" + encodeURIComponent(query) + "&format=json";

// json is a method of D3. This method is a promise and therefore can be chained with .then
json(connectionString)
	.then(data => showResults(data))
	.then(data => data.map(dataItem => deNestProperties(dataItem)))
	.then(data => transformData(data))
	.then(data => visualizeData(data))

// The preferred results of the data is nested into an object called bindings which is nested in an object called results. This function returns the preferred data.
function showResults(data) {
	return data.results.bindings;
}

// The preferred data has the values nested into another object. This function makes the data look like this: key: value
function deNestProperties(data) {
	return Object.assign({}, data, {
		cho: data.cho.value,
		placeName: data.placeName.value,
		title: data.title.value,
		type: data.type.value.toLowerCase()
	});
}
// This function groups the weapon types and counts how many weapons are present per weapon type.
function transformData(data) {
	let newData = nest().key( d => d.type).entries(data);
	newData.forEach(item => item.key = item.key[0].toUpperCase() + item.key.slice(1));
	newData.forEach(item => item.amount = item.values.length);
	return newData;
}
// This function visualizes the transformed data
// Based on example from https://bl.ocks.org/alokkshukla/3d6be4be0ef9f6977ec6718b2916d168
function visualizeData(data) {
	// To make a bubblechart the data needs to be nested into a parent object.
	const dataset = {
		children: data
	}

	// Scale the svg dimensions based on the width and height of the browser
	const height = window.innerHeight - 100;
	const width = window.innerWidth - 100;

	// Use a color scheme from D3
	const color = scaleOrdinal(schemeCategory10);

	// This packs the bubble
	const bubble = pack(dataset)
		.size([width, height])
		.padding(10);

	// This decides the size of the svg
	const svg = select("#svgcontainer")
		.append("svg")
		.attr("width", width)
		.attr("height", height)
		.attr("class", "bubble");


	// this selects all the nodes and puts it in an array
	const nodes = hierarchy(dataset)
		.sum(function(d){ return d.amount });

	// this selects all of the individual nodes, adds a "g" element to all the nodes and adds a class as well
	const node = svg.selectAll(".node")
		.data(bubble(nodes).descendants())
		.enter()
		.filter(function(d){
			return !d.children;
		})
		.append("g")
		.attr("class", "node")
            .attr("transform", function(d) {
                return "translate(" + d.x + "," + d.y + ")";
            });

	// This adds a title to every individual bubble
    node.append("title")
        .text(function(d) {
            return d.data.key + ": " + d.data.amount;
        });

	// this nests the bubble contents into a container. I did this so i could add transitions to my entire bubble
    node.append("g").attr("class", "bubble-container").append("circle")
        .attr("r", function(d) {
            return d.r;
        })
        .style("fill", function(d,i) {
            return color(i);
        });

	// This selects the container of an individual bubble and adds the text of the weapon type to it.
    node.select(".bubble-container").append("text")
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

		// This is a click function that when clicked displays the weapon type and value of the clicked bubble
		// Based on example from https://observablehq.com/@johnhaldeman/tutorial-on-d3-basics-and-circle-packing-heirarchical-bubb
		const selectBubble = d => {

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
				.text(d.data.key + ": " + d.data.amount)
				.attr("y", "16")
		}
		node.on("click", selectBubble);

        select(self.frameElement)
            .style("height", height + "px");
	}
