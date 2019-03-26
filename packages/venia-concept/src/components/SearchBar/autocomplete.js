import React, { useCallback, useContext, useEffect, useState } from "react"
import debounce from "lodash.debounce"
import { useFieldState } from "informed"
import { ApolloContext } from "react-apollo/ApolloContext"

import PRODUCT_SEARCH from "src/queries/productSearch.graphql"
import SuggestedCategories from "./suggestedCategories"
import SuggestedProducts from "./suggestedProducts"

const debounceTimeout = 200
const suggestedCategoriesLimit = 4
const suggestedProductsLimit = 3

const useQueryResultState = () => {
    const [data, setData] = useState(null)
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)

    return { data, error, loading, setData, setError, setLoading }
}

// map Magento 2.3.1 schema changes to Venia 2.0.0 proptype shape to maintain backwards compatibility
const mapProducts = products => products.map(product => {
    const { small_image } = product;

    return {
        ...product,
        small_image:
            typeof small_image === "object"
                ? small_image.url
                : small_image
    }
})

const Suggestions = props => {
    const { executeSearch, history, setVisible, value } = props
    const client = useContext(ApolloContext)
    const { data, loading, setData, setLoading } = useQueryResultState()

    const runQuery = useCallback(
        debounce(inputText => {
            client
                .query({
                    query: PRODUCT_SEARCH,
                    variables: { inputText },
                })
                .then(({ data }) => {
                    setData(data)
                    setLoading(false)
                })
        }, debounceTimeout),
        [setData, setLoading]
    )

    const handleCategorySearch = useCallback(
        event => {
            event.preventDefault()
            const { id } = event.currentTarget.dataset || event.srcElement.dataset

            setVisible(false)
            executeSearch(
                value,
                history,
                id
            );
        },
        [executeSearch, history, setVisible, value]
    )

    const handleOnProductOpen = useCallback(
        () => {
            setVisible(false)
        },
        [setVisible]
    )

    useEffect(() => {
        setLoading(true)
        runQuery(value)

        return runQuery.cancel
    }, [value])

    if (loading) {
        return (
            <div>
                <div>
                    {"loading"}
                </div>
            </div>
        )
    }

    if (!data || !data.products.items.length) {
        return (
            <div>
                <div>
                    No results found, try a different search
                </div>
            </div>
        )
    }

    const { filters, items } = data.products
    const categoryFilter = filters.find(
        filter => filter.name === 'Category'
    )
    const categorySuggestions = categoryFilter[
        'filter_items'
    ].slice(0, suggestedCategoriesLimit)

    return (
        <div>
            <SuggestedCategories
                handleCategorySearch={handleCategorySearch}
                autocompleteQuery={value}
                categorySuggestions={categorySuggestions}
            />
            <SuggestedProducts
                handleOnProductOpen={handleOnProductOpen}
                items={mapProducts(
                    items.slice(0, suggestedProductsLimit)
                )}
            />
        </div>
    )
}

const Autocomplete = props => {
    const { executeSearch, history, setVisible, visible } = props
    const { value } = useFieldState("search_query")
    const valid = value && value.length > 2

    if (!visible || !valid) {
        return null
    }

    return (
        <Suggestions
            executeSearch={executeSearch}
            history={history}
            setVisible={setVisible}
            value={value}
        />
    )
}

export default Autocomplete
