import React, { Fragment } from "react"
import { Link } from "src/drivers"

import SuggestedProduct from "./suggestedProduct"

const suggestedCategoriesLimit = 4
const suggestedProductsLimit = 3

// map Magento 2.3.1 schema changes to Venia 2.0.0 proptype shape to maintain backwards compatibility
const mapProduct = product => {
    const { small_image } = product;

    return {
        ...product,
        small_image:
            typeof small_image === "object"
                ? small_image.url
                : small_image
    }
}

const getUri = (searchValue, categoryId) => {
    const uri = new URL("/search.html", window.location)

    uri.searchParams.set("query", searchValue)
    uri.searchParams.set("category", categoryId)

    const { pathname, search } = uri

    // return only the pieces React Router wants
    return { pathname, search }
}

const Suggestions = props => {
    const { products, searchValue, visible } = props
    const { filters, items } = products

    if (!visible || !filters || !items) {
        return null
    }

    const categoryLinks = filters
        .find(({ name }) => name === 'Category')
        .filter_items
        .slice(0, suggestedCategoriesLimit)
        .map(({ label, value_string: categoryId }) => (
            <li key={categoryId}>
                <Link to={getUri(searchValue, categoryId)}>
                    <span>{`${searchValue} in ${label}`}</span>
                </Link>
            </li>
        ))

    const productLinks = items
        .slice(0, suggestedProductsLimit)
        .map(item => (
            <li key={item.id}>
                <SuggestedProduct {...mapProduct(item)} />
            </li>
        ))

    return (
        <Fragment>
            <ul>
                {categoryLinks}
            </ul>
            <ul>
                {productLinks}
            </ul>
        </Fragment>
    )
}

export default Suggestions
