import React from 'react'
import { Div } from 'glamorous'

import ResultTable from './ResultTable'
import { HeaderStyle2 } from './HeaderStyle'

const DeploymentResult = ({ address, ipfs, name, notes }) => {
  if (!name) {
    return null
  }
  const header = {
    name: `Deployed Contract`,
    color: `6025AE`,
    value: name,
  }

  const rows = [
    {
      name: `IPFS`,
      url: `https://ipfs.xyo.network/ipfs/${ipfs}`,
      value: ipfs,
    },
    {
      name: `Address`,
      value: address,
    },
    notes && {
      name: `Notes`,
      value: notes,
    },
  ].filter(Boolean)

  return (
    <Div
      css={{
        display: `flex`,
        flexDirection: `row`,
        justifyContent: `center`,
      }}
    >
      <Div
        css={{
          display: `flex`,
          flexDirection: `column`,
          justifyContent: `center`,
        }}
      >
        <HeaderStyle2>Successfully Deployed {name}</HeaderStyle2>
        <ResultTable header={header} rows={rows} />
      </Div>
    </Div>
  )
}
export default DeploymentResult
