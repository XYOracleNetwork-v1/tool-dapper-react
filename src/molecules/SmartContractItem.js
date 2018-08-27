import React from 'react'
import { contractNamed } from '../web3'
import { Div } from 'glamorous'
import { Link, Route } from "react-router-dom";
import { MethodItem } from './MethodItem'

export const MethodLink = ({match, method}) => {
  return (
    <Div key={method.signature}>
      <Link to={`${match.url}/${method.signature}`}> { method.name } </Link>
    </Div>
  )
}

export const SmartContractItem = (props) => {
    let { match } = props
    let contractName = match.params.contract
    let contract = contractNamed(contractName)
    if (!contract) {
      return null
    }
    let sortedMethods = contract._jsonInterface
                    .sort((a, b) => a.name && b.name ? a.name.localeCompare(b.name) : 0)
                    .map(method => {
                      if (method.name && method.type==='function') {
                        return <MethodLink key={method.signature} match={match} method ={method} />
                      }
                      return undefined
                    })
                    
    return <Div css = {{ 
      display: 'flex',
      justifyContent: 'left',
      alignContent: 'left',
      flexDirection: 'column',
      textAlign: 'left',
    }}>
      <h3>{contractName}:</h3>

        <Div css={{
          display:'flex',
          flexDirection:'row',
          alignContent: 'left',
          textAlign: 'left',
        }}>
          <Div css={{
            width: 300
          }}>
            Functions
            <ul>
              { sortedMethods }
            </ul>
          </Div>
          <Div css={{
            width: 400
          }}>
          <Route path={`/:contract/:method`} component={MethodItem} />
          </Div>
        </Div>
      </Div>
  }
