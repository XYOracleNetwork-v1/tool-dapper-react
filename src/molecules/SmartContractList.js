import React from 'react';
import {SmartContracts} from '../web3'
import {Div} from 'glamorous'
import { Route, Link } from "react-router-dom";
import { SmartContract } from './SmartContract'



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
                console.log("CONTRACT", contract)
            return (
            <Div key={contract.name}>
                   <Link to={`/${contract.name}`} params={{...contract}}>{contract.name}</Link>
            </Div>
            )})
        }

      </Div>
    )
  }