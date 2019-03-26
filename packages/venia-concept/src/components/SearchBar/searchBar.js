import React, { useCallback, useEffect, useRef, useState } from "react"
import { Form } from "informed"

import { mergeClasses } from "src/classify"
import Autocomplete from "./autocomplete"
import SearchField from "./searchField"
import defaultClasses from "./searchBar.css"

const initialValues = { search_query: "" }

const SearchBar = props => {
    const { executeSearch, history, isOpen, location } = props
    const searchRef = useRef(null)
    const [expanded, setExpanded] = useState(false)
    const classes = mergeClasses(defaultClasses, props.classes)
    const className = isOpen ? classes.root_open : classes.root

    // after mount: add listener to collapse autocomplete
    // after unmount: remove listener
    useEffect(
        () => {
            const collapse = ({ target }) => {
                if (!searchRef.current.contains(target)) {
                    setExpanded(false)
                }
            }

            document.addEventListener("mousedown", collapse)

            // return a callback, which is called on unmount
            return () => {
                document.removeEventListener("mousedown", collapse)
            }
        },
        [setExpanded]
    )

    // expand or collapse on change
    const handleChange = useCallback(
        value => {
            setExpanded(!!value)
        },
        [setExpanded]
    )

    // expand on focus
    const handleFocus = useCallback(
        () => {
            setExpanded(true)
        },
        [setExpanded]
    )

    // perform search on form submit
    const handleSubmit = useCallback(
        ({ search_query }) => {
            executeSearch(search_query, history)
        },
        [executeSearch, history]
    )

    return (
        <div className={className}>
            <div ref={searchRef} className={classes.searchInner}>
                <Form
                    autoComplete="off"
                    className={classes.form}
                    initialValues={initialValues}
                    onSubmit={handleSubmit}
                >
                    <SearchField
                        location={location}
                        onChange={handleChange}
                        onFocus={handleFocus}
                    />
                    <div className={classes.autocomplete}>
                        {expanded ? "expanded" : "collapsed"}
                        <Autocomplete
                            executeSearch={executeSearch}
                            history={history}
                            setVisible={setExpanded}
                            visible={expanded}
                        />
                    </div>
                </Form>
            </div>
        </div>
    )
}

export default SearchBar
