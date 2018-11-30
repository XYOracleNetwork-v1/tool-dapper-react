import React from "react"
import { Div } from "glamorous"

const CurNetwork = ({ account, network }) => {
  let returnDivs = []

  returnDivs.push(
    <Div key='account' className='account-right'>
      Wallet: {account ? account : `None Found`}
    </Div>,
  )
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
