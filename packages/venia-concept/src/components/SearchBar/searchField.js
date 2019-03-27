import React, { useCallback } from "react"
import { useFieldState } from "informed"
import ClearIcon from "react-feather/dist/icons/x"
import SearchIcon from "react-feather/dist/icons/search"

import Icon from "src/components/Icon"
import TextInput from "src/components/TextInput"
import Trigger from "src/components/Trigger"
import useSearchField from "./useSearchField"

const clearIcon = <Icon src={ClearIcon} size={18} />
const searchIcon = <Icon src={SearchIcon} size={18} />

const SearchField = props => {
    const { location, onChange, onFocus } = props
    const { value } = useFieldState("search_query")
    const { formApi } = useSearchField({ location, onChange })

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
            onFocus={onFocus}
            onValueChange={onChange}
        />
    )
}

export default SearchField
