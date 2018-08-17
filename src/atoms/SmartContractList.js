import React from 'react';
import {SmartContracts} from '../web3'
import {Div} from 'glamorous'
import { Link } from "react-router-dom";

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
            return (
              <Div key={contract.name}>
                <Link to={`/${contract.name}`} params={{...contract}}>{contract.name}</Link>
              </Div>
            )})
        }

      </Div>
    )
  }