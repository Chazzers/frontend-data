# frontend-data

Interactive visualisation of data through the database of the 'NMVW' and the JavaScript library D3

## Concept - Datavisualisation of the collection of weapons from different regions from the NMVW Database

This app visualises all of the weapons of the collection of the database in a bubblechart. The app uses the JavaScript library D3 and the database of the "Nationaal Museum Van Wereldculturen" (NMVW).

![The new concept](https://user-images.githubusercontent.com/33430669/69834126-c3c29800-1238-11ea-8c4a-28f72e0b0dd4.png)

## SPARQL query to fetch data

To get data from the NMVW database i had to make use of SPARQL. SPARQL (SPARQL Protocol And RDF Query Language) is a RDF query language that is used to get RDF-based data through queries.

The data fetched from the database and plotted in a bubble chart are the data of weapons found in different regions in the world that are now in possession of the NMVW.

This project makes use of dynamic fetching based on user input to get data from a specific region. To get the right regions i used a query to fetch all the regions in which the object data is nested.

```
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
```

After getting all the regions the second query is executed when the user selects a region. This query then fetches all the weapons nested in the regions.

```
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
```

More about this can be found in the chapters: [05. Getting the data](https://github.com/Chazzers/frontend-data/wiki/05.-Getting-the-data) and [08. Creating an interaction](https://github.com/Chazzers/frontend-data/wiki/09.-Creating-an-interaction)

Source: [Wikipedia SPARQL](https://nl.wikipedia.org › wiki › SPARQL)

## Getting started

### Installation

This project makes use of Rollup to build the app. If you want to run the app you will have to install Rollup globally like this:

`npm install rollup -g`

To install the project use npm install.

`npm install`

To create a development environment use:

`npm run dev`

To build for production use:

`npm run build`

## Wiki

Click [here](https://github.com/Chazzers/functional-programming/wiki) to read the proces behind creating this app.

## Acknowledgments

* The NMVW
* D3 - JavaScript library
* [Simple Bubble Chart D3 v4 - example](https://bl.ocks.org/alokkshukla/3d6be4be0ef9f6977ec6718b2916d168)
* [Tutorial on D3 Basics and Circle Packing (Heirarchical Bubble Charts)](https://observablehq.com/@johnhaldeman/tutorial-on-d3-basics-and-circle-packing-heirarchical-bubb)
* [Clean data assignment](https://github.com/Chazzers/functional-programming/tree/master/clean-data-assignment)
* Martijn for the motivation!!! I couldn't have done it without him.
* Kris for helping me place the bubblechart underneath the right select.
* Wiebe and Mohammed for peer reviewing my wiki and code.
* Laurens for helping me understand the enter update and exit pattern
