import React, { useCallback, useEffect, useRef, useState } from "react"
import { Form } from "informed"
import ClearIcon from "react-feather/dist/icons/x"
import SearchIcon from "react-feather/dist/icons/search"

import { mergeClasses } from "src/classify"
import Icon from "src/components/Icon"
import TextInput from "src/components/TextInput"
import Trigger from "src/components/Trigger"
import getQueryParameterValue from "src/util/getQueryParameterValue"
import SearchAutocomplete from "./autocomplete"
import defaultClasses from "./searchBar.css"

const clearIcon = <Icon src={ClearIcon} size={18} />
const searchIcon = <Icon src={SearchIcon} size={18} />

const initialValues = { search_query: "" }

const SearchBar = props => {
    const { executeSearch, history, isOpen, location } = props
    const formApi = useRef(null)
    const searchRef = useRef(null)
    const [dirty, setDirty] = useState(false)
    const [expanded, setExpanded] = useState(false)
    const classes = mergeClasses(defaultClasses, props.classes)
    const className = isOpen ? classes.root_open : classes.root
    console.log({ expanded })

    const searchQuery = formApi.current
        ? formApi.current.getValue("search_query") || ""
        : ""

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

    // update search field when location changes
    useEffect(
        () => {
            const searchParam = getQueryParameterValue({
                location,
                queryParameter: "query"
            })

            if (formApi.current && searchParam) {
                formApi.current.setValue("search_query", searchParam)
            }
        },
        [formApi, location]
    )

    // set dirty state on form change
    const handleFormChange = useCallback(
        ({ values }) => {
            console.log("form change")
            setDirty(!!values.search_query)
        },
        [setDirty]
    )

    // perform search on form submit
    const handleFormSubmit = useCallback(
        ({ search_query }) => {
            console.log("form submit", { search_query })
            executeSearch(search_query, history)
            setExpanded(false)
        },
        [executeSearch, history, setExpanded]
    )

    // expand autocomplete on input change
    const handleInputChange = useCallback(
        value => {
            console.log("input change", { value })
            setExpanded(true)
        },
        [setExpanded]
    )

    // expand autocomplete on input focus
    const handleInputFocus = useCallback(
        () => {
            console.log("input focus")
            setExpanded(true)
        },
        [setExpanded]
    )

    // save form api as a ref
    const saveFormApi = useCallback(
        api => {
            formApi.current = api
        },
        []
    )

    // reset form state
    const resetForm = useCallback(
        () => {
            console.log("reset form")
            setExpanded(false)
            formApi.current.reset()
        },
        [setExpanded]
    )

    const resetButton = dirty
        ? <Trigger action={resetForm}>{clearIcon}</Trigger>
        : null

    return (
        <div className={className}>
            <div ref={searchRef} className={classes.searchInner}>
                <Form
                    autoComplete="off"
                    className={classes.form}
                    getApi={saveFormApi}
                    initialValues={initialValues}
                    onChange={handleFormChange}
                    onSubmit={handleFormSubmit}
                >
                    <TextInput
                        after={resetButton}
                        before={searchIcon}
                        field="search_query"
                        onValueChange={handleInputChange}
                        onFocus={handleInputFocus}
                    />
                    <div className={classes.autocomplete}>
                        <SearchAutocomplete
                            autocompleteVisible={expanded}
                            executeSearch={executeSearch}
                            history={history}
                            searchQuery={searchQuery}
                            updateAutocompleteVisible={setExpanded}
                        />
                    </div>
                </Form>
            </div>
        </div>
    )
}

export default SearchBar
