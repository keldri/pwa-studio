import { useEffect } from "react"
import { useFormApi } from "informed"

import getQueryParameterValue from "src/util/getQueryParameterValue"

export default props => {
    const { location, onChange } = props
    const formApi = useFormApi()

    // update search field when location changes
    useEffect(
        () => {
            const searchParam = getQueryParameterValue({
                location,
                queryParameter: "query"
            })

            // populate the field
            if (searchParam) {
                formApi.setValue("search_query", searchParam)
            }

            // trigger the effects of clearing the field
            onChange("")
        },
        [formApi, location]
    )

    return { formApi }
}
