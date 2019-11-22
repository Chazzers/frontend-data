import { json, nest, create, select, selectAll, pack, scaleOrdinal, schemeCategory10, hierarchy } from 'd3';
import { makeQueryRegions } from './makeQueryRegions.js';
import { showResults, deNestProperties, deNestPropertiesLanden, transformData, createSvg } from './cleanData.js';
import { makeQueryWeapons } from "./makeQueryWeapons.js";
import "../styles/main.scss";

json(makeQueryRegions())
	.then(data => showResults(data))
	.then(data => data.map(dataItem =>  deNestPropertiesLanden(dataItem)))
	.then(data => createOptions(data))
	.then(() => createSvg());

document.getElementById("chart1").addEventListener("change", makeQueryWeapons);
document.getElementById("chart2").addEventListener("change", makeQueryWeapons);

function createOptions(data) {
	const selects = document.querySelectorAll(".select");

	const options = data.forEach(dataItem => selects.forEach(select => select.add(new Option(dataItem.placeName, dataItem.place1))));
	return options;
}
