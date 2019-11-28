import { url } from "./url.js";

function makeQueryRegions() {
	// Url of api endpoint
	const queryRegions = `
	PREFIX dct: <http://purl.org/dc/terms/>
	PREFIX dc: <http://purl.org/dc/elements/1.1/>
	PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
	PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
	PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
	PREFIX edm: <http://www.europeana.eu/schemas/edm/>
	PREFIX foaf: <http://xmlns.com/foaf/0.1/>

	SELECT ?place1 (count(?place1) AS ?placeCount) ?placeName (count(?type) AS ?typeCount) WHERE {
	  <https://hdl.handle.net/20.500.11840/termmaster2> skos:narrower ?place .
	  ?place skos:narrower ?place1 .
	  ?place1 skos:prefLabel ?placeName .

	 VALUES ?type { "zwaard" "Zwaard" "boog" "Boog" "lans" "Lans" "mes" "Mes" "knots" "Knots" "piek" "Piek" "vechtketting" "Vechtketting" "dolk" "Dolk" "bijl" "Bijl" "strijdzeis" "Strijdzeis" "boksbeugel" "Boksbeugel" }

	  ?cho 	dct:spatial ?place1 ;
	        dc:type ?type .

	} GROUP BY ?place1 ?placeName
	`;

	// This creates adds the query to the url and transforms it into something that the browser understands
	const connectionStringRegions = url + "?query=" + encodeURIComponent(queryRegions) + "&format=json";

	return connectionStringRegions;
}

export { makeQueryRegions };
