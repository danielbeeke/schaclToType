# SHACL to Type

This function (`shaclToType`) converts given SHACL shapes in the form of an N3 store into one or multiple TypeScript types.

## This is a work in progress

For https://dbpedia.org/sparql

```SPARQL
prefix dbo: <http://dbpedia.org/ontology/>
prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX foaf:    <http://xmlns.com/foaf/0.1/>
PREFIX vcard:   <http://www.w3.org/2001/vcard-rdf/3.0#>


CONSTRUCT   { 
  ?s foaf:birthDate ?birthDate .
  ?s foaf:name ?name .
  ?s foaf:influenced_by ?influencedBy 
}
WHERE       {
  	VALUES ?s { <http://dbpedia.org/resource/Søren_Kierkegaard> <http://dbpedia.org/resource/Immanuel_Kant> }
  
    # BirthDay  
  	?s dbo:birthDate ?birthDate .
  
    # Name
	  OPTIONAL {
    	?s rdfs:label ?name_en .
  	}
	  OPTIONAL {
    	?s rdfs:label ?name_nl .
  	}
  
    BIND(COALESCE(?name_en, ?name_nl) as ?name)
    FILTER (langMatches(lang(?name_nl), 'nl'))
    FILTER (langMatches(lang(?name_en), 'en'))
  
    # InfluencedBy
  	OPTIONAL {
  		?s dbo:influencedBy ?influencedBy
  	}
}
```