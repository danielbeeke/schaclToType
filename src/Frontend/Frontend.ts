export type RdfJsonTerm = {
    type: 'bnode' | 'uri' | 'literal' | 'defaultgraph',
    value: string,
    lang?: string,
    datatype?: string
}

export type RdfJsonRoot = {
    [key: string]: RdfJsonNode
}

export type RdfJsonNode = {
    [key: string]: Array<RdfJsonTerm | RdfJsonNode>
}

export const rdfTermValueToTypedVariable = (value: RdfJsonTerm) => {
    if (value.datatype === 'http://www.w3.org/2001/XMLSchema#date') return new Date(value.value)
    if (value.datatype === 'http://www.w3.org/2001/XMLSchema#integer') return parseInt(value.value)
    if (value.datatype === 'http://www.w3.org/2001/XMLSchema#string') return value.value
    if (value.datatype === 'http://www.w3.org/1999/02/22-rdf-syntax-ns#langString') return value.value

    if (value.type === 'literal') return value.value
    if (value.type === 'uri') return value.value

    return value.value
}

const nestGraphs = (graphs: RdfJsonRoot, rootUri: string) => {
    const finalObject = Object.entries(graphs).find(([uri]) => uri === rootUri)?.[1]
    if (!finalObject) throw new Error('Object not found')

    for (const [iri, graph] of Object.entries(graphs)) {
        const entries = Array.isArray(graph) ? graph.entries() : Object.entries(graph)
        for (const [key, values] of entries) {
            for (const [index, value] of values.entries()) {
                if ((value.type === 'uri' || value.type === 'bnode') && typeof value.value === 'string' && graphs[value.value]) {
                    const newValue = graphs[value.value] as unknown as RdfJsonTerm | RdfJsonNode
                    (newValue as RdfJsonNode)['id__S'] = [{ value: value.value, type: 'literal' }]
                    graphs[iri][key][index] = newValue
                }
            }
        }
    }

    return finalObject
}

const convertRdfGraphToJson = (graph: RdfJsonNode) => {
    const returnGraph: any = {}

    for (const [predicateWithMeta, values] of Object.entries(graph)) {
        const [cleanedPredicate, metaCharacters] = predicateWithMeta
            .replace('urn:empty/', '')
            .split('__')

        const castedValues = values.map(value => {
            if (value.type) return rdfTermValueToTypedVariable(value as RdfJsonTerm)
            return convertRdfGraphToJson(value as RdfJsonNode)
        })

        returnGraph[cleanedPredicate] = metaCharacters.includes('S') ? castedValues[0] : castedValues
    }

    return returnGraph
}


export const fetchQuery = async (endpoint: string, inputQuery: string, iris: Array<string>) => {
    const query = inputQuery.replaceAll('[IRIS]', iris.map(iri => iri.includes('://') ? `<${iri}>` : iri).join(' '))
    const body = new FormData()
    body.set('query', query)

    const response = await fetch(endpoint, {
        method: 'POST', body, headers: { Accept: 'application/rdf+json' }
    })

    const graphs: RdfJsonRoot = await response.json()
    const returnObject: any = {}

    for (const iri of iris) {
        returnObject[iri] = convertRdfGraphToJson(nestGraphs(graphs, iri))
        returnObject[iri].id = iri
    }

    return Object.values(returnObject)
}