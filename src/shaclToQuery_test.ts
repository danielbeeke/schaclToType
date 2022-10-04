import { turtleToStore } from './helpers/turtleToStore.ts'
import { shaclToQuery } from './shaclToQuery.ts'
import { it, describe } from './deps.ts'
import { assertEquals } from 'https://deno.land/std@0.152.0/testing/asserts.ts'

const expectedQuery = `PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX sh: <http://www.w3.org/ns/shacl#>
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
PREFIX dbp: <http://dbpedia.org/property/>
PREFIX dbo: <http://dbpedia.org/ontology/>

CONSTRUCT {
	?s a <http://subject.com/subject> .


	# name
	?s dbp:name ?name .

	# rdf_type
	?s rdf:type ?rdf_type .

	# alt
	?s dbp:alt ?alt .

	# birthPlace
	?s dbp:birthPlace ?birthPlace .
	# birthPlace_rdf_type
	?birthPlace rdf:type ?birthPlace_rdf_type .

	# birthPlace_name
	?birthPlace dbp:name ?birthPlace_name .

	# birthDate
	?s dbp:birthDate ?birthDate .
}
WHERE {
	VALUES ?s { }

	# name
	OPTIONAL {
		?s dbp:name ?name_en .
		FILTER (lang(?name_en) = 'en')
	}
	OPTIONAL {
		?s dbp:name ?name_nl .
		FILTER (lang(?name_nl) = 'nl')
	}
	BIND(COALESCE(?name_en, ?name_nl) as ?name)


	# rdf_type
	?s rdf:type ?rdf_type .
	FILTER (?rdf_type IN (<http://dbpedia.org/ontology/Philosopher>))

	# alt
	OPTIONAL {
		?s dbp:alt ?alt_en .
		FILTER (lang(?alt_en) = 'en')
	}
	OPTIONAL {
		?s dbp:alt ?alt_nl .
		FILTER (lang(?alt_nl) = 'nl')
	}
	BIND(COALESCE(?alt_en, ?alt_nl) as ?alt)


	# birthPlace
	OPTIONAL {
		?s dbp:birthPlace ?birthPlace .
	# birthPlace_rdf_type
	?birthPlace rdf:type ?birthPlace_rdf_type .
	FILTER (?birthPlace_rdf_type IN (<http://dbpedia.org/ontology/Location>))

	# name
	OPTIONAL {
		?birthPlace dbp:name ?birthPlace_name_en .
		FILTER (lang(?birthPlace_name_en) = 'en')
	}
	OPTIONAL {
		?birthPlace dbp:name ?birthPlace_name_nl .
		FILTER (lang(?birthPlace_name_nl) = 'nl')
	}
	BIND(COALESCE(?birthPlace_name_en, ?birthPlace_name_nl) as ?birthPlace_name)

	}

	# birthDate
	?s dbp:birthDate ?birthDate .
}
`

describe('shaclToQuery', () => {
  it('converts a SHACL shape to a SPARQL query', async () => {
    const fileData = await Deno.readTextFile(`./shapes/Philosopher.ttl`)
    const { store: shape, prefixes } = await turtleToStore(fileData)
    const context = Object.assign({ '@vocab': prefixes.dbp }, prefixes)
    const query = await shaclToQuery(shape, {
      prefixes: context,
      languages: ['en', 'nl']
    })

    assertEquals(query, expectedQuery)
  })
})