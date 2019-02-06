import React from 'react'
import { Div } from 'glamorous'

import Button from '../atoms/Button'

const CurrentNetwork = ({ account, network, connectProvider }) => (
  <Div>
    {network ? (
      <>
        <Div css={{ fontSize: 14, paddingTop: 10 }}>
          {account ? `Wallet: ${account}` : 'No Wallet Connected'}
        </Div>
        <Div css={{ fontSize: 14 }}>Network: {network}</Div>
      </>
    ) : (
      <Button
        css={{ marginTop: 10, marginRight: 0, width: 250 }}
        onClick={connectProvider}
      >
        Connect Wallet
      </Button>
    )}
  </Div>
)

export default CurrentNetwork
