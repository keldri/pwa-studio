import { useCallback, useEffect, useRef, useState } from "react"

export const useSearch = props => {
    const { executeSearch, history } = props
    const searchRef = useRef(null)
    const [expanded, setExpanded] = useState(false)

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
                console.log("removing mousedown listener")
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

    return {
        expanded,
        handleChange,
        handleFocus,
        handleSubmit,
        searchRef,
        setExpanded
    }
}
