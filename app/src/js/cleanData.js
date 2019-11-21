import { selectAll, nest } from "d3";
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

function deNestPropertiesLanden(data) {
	return Object.assign({}, data, {
		place1: data.place1.value,
		placeCount: data.placeCount.value,
		placeName: data.placeName.value,
		typeCount: data.typeCount.value
	});
}

// This function groups the weapon types and counts how many weapons are present per weapon type.
function transformData(data) {
	let newData = nest().key( d => d.type).entries(data);
	newData.forEach(item => item.key = item.key[0].toUpperCase() + item.key.slice(1));
	newData.forEach(item => item.amount = item.values.length);
	return newData;
}

function createSvg() {
	// Scale the svg dimensions based on the width and height of the browser
	const height = window.innerHeight / 2.2;
	const width = window.innerWidth / 2.2;


	const svg = selectAll(".chart")
		.selectAll(".svg-container")
		.append("svg")
		.attr("width", width)
		.attr("height", height)
		.attr("class", "bubble");
}

export { showResults, deNestProperties, deNestPropertiesLanden, transformData, createSvg };
