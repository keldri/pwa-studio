import React from "react"
import { Form } from "informed"

import { mergeClasses } from "src/classify"
import Autocomplete from "./autocomplete"
import SearchField from "./searchField"
import { useSearch } from "./useSearch"
import defaultClasses from "./searchBar.css"

const initialValues = { search_query: "" }

const SearchBar = props => {
    const { executeSearch, history, isOpen, location } = props
    const { expanded, handleChange, handleFocus, handleSubmit, searchRef, setExpanded } = useSearch({ executeSearch, history })

    const classes = mergeClasses(defaultClasses, props.classes)
    const className = isOpen ? classes.root_open : classes.root

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
