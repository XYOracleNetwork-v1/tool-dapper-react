import React from 'react'
import { Div } from 'glamorous'
import { Seperator } from '../atoms/Seperator'

export const TransactionError = ({error}) => {
    if (error === undefined) return null
    return (
        <Div>
            <Seperator />
            Error Executing: {error.toString()}
        </Div>
    )
}
