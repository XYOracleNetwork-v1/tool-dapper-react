import React from "react"
import { Div } from "glamorous"

const WalletDiv = account => {
  if (account) {
    return (
      <Div key='account' className='account-right'>
        Wallet: {account}
      </Div>
    )
  }
  return (
    <Div key='account' className='account-right'>
      No Wallet Connected
    </Div>
  )
}

const CurNetwork = ({ account, name }) => {
  let returnDivs = []
  returnDivs.push(WalletDiv(account))
  if (name) {
    returnDivs.push(
      <Div key='network' className='network-right'>
        Network: {name}
      </Div>,
    )
  }
  return <Div>{returnDivs}</Div>
}

export default CurNetwork
