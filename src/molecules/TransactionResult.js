import React from 'react'
import { Div } from 'glamorous'
import { Seperator } from '../atoms/Seperator'

export const TransactionResult = ({result}) => {
    if (result === undefined) return null
    return (
        <Div>
            <Seperator />
            Execution Result: {result.toString()}
        </Div>
    )
}
