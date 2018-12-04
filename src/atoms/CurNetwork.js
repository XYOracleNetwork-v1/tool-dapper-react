import React from "react"
import { Div, Button } from "glamorous"

const WalletDiv = (account) => {
  if (account) {
    return (
      <Div key='account' className='account-right'>
        Wallet: {account}
      </Div>
    )
  }
  return <Div key='account' className='account-right'>
    No Wallet Connected
  </Div>
}

const CurNetwork = ({ account, network }) => {
  let returnDivs = []

  returnDivs.push(WalletDiv(account))
  if (network) {
    returnDivs.push(
      <Div key='network' className='network-right'>
        Network: {network}
      </Div>,
    )
  }
  return <Div>{returnDivs}</Div>
}

export default CurNetwork
