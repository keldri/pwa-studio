import React, { useCallback, useEffect, useRef, useState } from "react"
import { useFieldState, useFormApi } from "informed"
import ClearIcon from "react-feather/dist/icons/x"
import SearchIcon from "react-feather/dist/icons/search"

import Icon from "src/components/Icon"
import TextInput from "src/components/TextInput"
import Trigger from "src/components/Trigger"
import getQueryParameterValue from "src/util/getQueryParameterValue"

const clearIcon = <Icon src={ClearIcon} size={18} />
const searchIcon = <Icon src={SearchIcon} size={18} />

const SearchField = props => {
    const { location, onChange, onFocus } = props
    const formApi = useFormApi()
    const { value } = useFieldState("search_query")

    // update search field when location changes
    useEffect(
        () => {
            const searchParam = getQueryParameterValue({
                location,
                queryParameter: "query"
            })

            if (searchParam) {
                // update the field value
                formApi.setValue("search_query", searchParam)
                // collapse the autocomplete
                onChange("")
            }
        },
        [formApi, location]
    )

    const handleValueChange = useCallback(
        value => {
            onChange(value)
        },
        [onChange]
    )

    const handleFocus = useCallback(
        () => {
            onFocus()
        },
        [onFocus]
    )

    const resetForm = useCallback(
        () => {
            formApi.reset()
        },
        [formApi]
    )

    const resetButton = value
        ? <Trigger action={resetForm}>{clearIcon}</Trigger>
        : null

    return (
        <TextInput
            after={resetButton}
            before={searchIcon}
            field="search_query"
            onFocus={handleFocus}
            onValueChange={handleValueChange}
        />
    )
}

export default SearchField
