import { url } from "./url.js";
import { runQueryWeapons } from "./runQueryWeapons.js";

function makeQueryWeapons(event) {
	// Get the option value of the select input
	const optionValue = event.target.value;
	// Get the id of the select input
	const selectId = event.currentTarget.id;
	// Assign the query to the query variable
	const query = `
	PREFIX dct: <http://purl.org/dc/terms/>
	PREFIX dc: <http://purl.org/dc/elements/1.1/>
	PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
	PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
	PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
	PREFIX edm: <http://www.europeana.eu/schemas/edm/>
	PREFIX foaf: <http://xmlns.com/foaf/0.1/>

	SELECT ?cho ?placeName ?title ?type WHERE {
	 <${optionValue}> skos:narrower* ?place .
	 ?place skos:prefLabel ?placeName .

	 VALUES ?type { "zwaard" "Zwaard" "boog" "Boog" "lans" "Lans" "mes" "knots" "Piek" "vechtketting" "dolk" "bijl" "strijdzeis" }


	  ?cho 	dct:spatial ?place ;
	        dc:title ?title ;
	        dc:type ?type .
			FILTER langMatches(lang(?title), "ned") .
	}
	`;
	// This creates adds the query to the url and transforms it into something that the browser understands
	const connectionString = url + "?query=" + encodeURIComponent(query) + "&format=json";

	return runQueryWeapons(connectionString, selectId);
}

export { makeQueryWeapons };
