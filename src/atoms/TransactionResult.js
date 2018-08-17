import React from 'react'
import { Div } from 'glamorous'
import { Seperator } from './Seperator'

export const TransactionResult = ({result}) => {
    if (result === undefined) {
        return null
    }
    console.log("Showing Result", result)

    return (
        <Div>
            <Seperator />
            Execution Result: {result.toString() ? result.toString() : "null"}
        </Div>
    )
}
