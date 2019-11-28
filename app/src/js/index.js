// This imports methods of D3
import { json, nest, create, select, selectAll, pack, scaleOrdinal, schemeCategory10, hierarchy } from 'd3';
// These imports import the modules of sepparated js files
import { makeQueryRegions } from './makeQueryRegions.js';
import { showResults, deNestProperties, deNestPropertiesLanden, transformData, createSvg } from './cleanData.js';
import { makeQueryWeapons } from "./makeQueryWeapons.js";
import "../styles/main.scss";

// This uses the method json of D3 to handle json data and execute functions
json(makeQueryRegions())
	.then(data => showResults(data))
	.then(data => data.map(dataItem =>  deNestPropertiesLanden(dataItem)))
	.then(data => createOptions(data))
	.then(() => createSvg());
// This adds a event listener to the first input select
document.getElementById("chart1").addEventListener("change", makeQueryWeapons);

// This adds a event listener to the first input select
document.getElementById("chart2").addEventListener("change", makeQueryWeapons);

// This creates the options for the input select
function createOptions(data) {
	const selects = document.querySelectorAll(".select");

	const options = data.forEach(dataItem => selects.forEach(select => select.add(new Option(dataItem.placeName, dataItem.place1))));
	return options;
}
