import React from 'react';
import {SmartContracts} from '../web3'
import {Div} from 'glamorous'
import { Route, Link } from "react-router-dom";
import { SmartContract } from './SmartContract'

const SmartContractItem = ({name}) => <Div>
    Select a smart contract
    </Div>

export const SmartContractList = ({match}) => {
    return (
      <Div
        css={{
            margin: 10,
            height: 20,

            display: 'flex',
            flexDirection: 'column',
            textAlign: 'left',

            
        }}
      > 
        {
            SmartContracts.map(contract => {
                console.log("MAtch", match)
            return <Div key={contract.name}>
                   <Link to={`${match.url}/${contract.name}`}>{contract.name}</Link>
            </Div>
            })
        }
        <Route path={`${match.url}/:contractName`} component={SmartContract} />

      </Div>
    )
  }