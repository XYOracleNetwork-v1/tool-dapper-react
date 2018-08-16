import React from 'react'
import { contractNamed } from '../web3'
import { Div } from 'glamorous'
import { Link} from "react-router-dom";

export const MethodItem = ({match, method}) => {
  return (
    <Div key={method.signature}>
    <Link to={`${match.url}/${method.signature}`}> { method.name } </Link>
    </Div>
  )
}
export const MethodList = ({match, sortedMethods}) => {
  console.log("B:AJ", match, sortedMethods)
  if (!sortedMethods.length > 0) {
    return null
  }
  let elements = []
  sortedMethods.forEach(method => {
    if (method) {
      elements.push(<MethodItem match={match} method ={method} />)
    }
  })
  console.log("ELEMENTS", elements)
  return (<Div>{elements} </Div>)
}

export const SmartContractItem = (props) => {
    let { match } = props
    let contractName = match.params.contract
    let contract = contractNamed(contractName)
    let sortedMethods = contract._jsonInterface
                    .sort((a, b) => a.name && b.name ? a.name.localeCompare(b.name) : 0)
                    .map(method => {
                      console.log(method.name)
                      if (method.name && method.type==='function') {
                        return <MethodItem match={match} method ={method} />
                      }
                      return undefined
                    })
                    
    console.log("SORTED", sortedMethods)

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
      {sortedMethods}
      </ul>
      </Div>
  }
