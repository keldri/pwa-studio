import React, { useCallback, useContext, useEffect, useState } from "react"
import debounce from "lodash.debounce"
import { useFieldState } from "informed"
import { ApolloContext } from "react-apollo/ApolloContext"

import { mergeClasses } from "src/classify"
import PRODUCT_SEARCH from "src/queries/productSearch.graphql"
import Suggestions from "./suggestions"
import defaultClasses from "./autocomplete.css"

const debounceTimeout = 200

const useQueryResultState = () => {
    const [data, setData] = useState(null)
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)

    return { data, error, loading, setData, setError, setLoading }
}

const Autocomplete = props => {
    const { visible } = props
    const { data, error, loading, setData, setError, setLoading } = useQueryResultState()

    const client = useContext(ApolloContext)
    const { value } = useFieldState("search_query")
    const classes = mergeClasses(defaultClasses, props.classes)
    const valid = value && value.length > 2
    let message = ""

    if (error) {
        message = "An error occurred while fetching results."
    } else if (loading) {
        message = "Fetching results..."
    } else if (!data) {
        message = "Search for a product"
    } else if (!data.products.items.length) {
        message = "No results were found."
    }

    const runQuery = useCallback(
        debounce(inputText => {
            client
                .query({
                    query: PRODUCT_SEARCH,
                    variables: { inputText },
                })
                .then(({ data, error }) => {
                    setData(data)
                    setError(!!error)
                    setLoading(false)
                })
        }, debounceTimeout),
        [setData, setLoading]
    )

    useEffect(() => {
        if (visible && valid) {
            setLoading(true)
            runQuery(value)
        } else if (!value) {
            setData(null)
            setLoading(false)
        }

        return () => {
            runQuery.cancel()
        }
    }, [valid, value, visible])

    return (
        <div className={classes.root}>
            <div className={classes.message}>
                {message || `${data.products.items.length} items`}
            </div>
            <div className={classes.suggestions}>
                <Suggestions
                    products={data ? data.products : {}}
                    searchValue={value}
                    visible={visible}
                />
            </div>
        </div>
    )
}

export default Autocomplete
