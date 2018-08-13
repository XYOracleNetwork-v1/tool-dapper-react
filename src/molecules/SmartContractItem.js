import React from 'react'
import { contractNamed } from '../web3'
import { Div } from 'glamorous'
import { Link} from "react-router-dom";

export const SmartContractItem = (props) => {
    let { match } = props
    let contractName = match.params.contract
    let contract = contractNamed(contractName)
    console.log("SMART CONTRACT", contract,  props)
    return <Div css = {{ 
      display: 'flex',
      justifyContent: 'left',
      alignContent: 'left',
      flexDirection: 'column',
      textAlign: 'left',
    }}>
      You Selected {contractName}:
      <Div>
        Functions
      </Div>
      <ul>
        {contract._jsonInterface.map(method => {
          if (method.name && method.type==='function') {
            return (
              <Div key={method.signature}>
              <Link to={`${match.url}/${method.signature}`}> { method.name } </Link>
              </Div>
            )
          }
          return undefined
        })}
      </ul>
      </Div>
  }
