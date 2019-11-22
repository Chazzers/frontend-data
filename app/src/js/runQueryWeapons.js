import { json } from 'd3';
import { showResults, deNestProperties, deNestPropertiesLanden, transformData, createSvg } from './cleanData.js';
import { getCurrentTarget } from "./getCurrentTarget.js"
import { createChart } from "./createChart.js"
function runQueryWeapons(connectionString, selectId) {
	// json is a method of D3. This method is a promise and therefore can be chained with .then
	return json(connectionString)
		.then(data => showResults(data))
		.then(data => data.map(dataItem => deNestProperties(dataItem)))
		.then(data => transformData(data))
		.then(data => createChart(data, selectId));
}

export { runQueryWeapons };
