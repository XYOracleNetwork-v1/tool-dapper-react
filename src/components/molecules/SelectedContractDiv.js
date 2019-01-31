import React, { Component } from 'react'
import { Div } from 'glamorous'
import ResultTable from '../atoms/ResultTable'
import { HeaderStyle2 } from '../atoms/HeaderStyle'

class SelectedContractDiv extends Component {
  deploymentsTable = deployments => {
    if (
      !deployments ||
      deployments.length === 0 ||
      !this.props.service.getNetworkNamed
    ) {
      return null
    }
    let rows = []
    deployments.forEach(dep => {
      const net = this.props.service.getNetworkNamed(dep.netId)
      console.log({ net, dep })
      if (!net) return
      const network = net.name
      let address = dep.notes ? dep.notes + ` - ` + dep.address : dep.address
      rows.push({ name: network, value: address })
    })

    let header = { name: `network`, value: `address`, color: `#3071D1` }
    return (
      <Div>
        <HeaderStyle2>Deployments</HeaderStyle2>

        <ResultTable header={header} rows={rows} />
      </Div>
    )
  }

  render() {
    let { contract } = this.props.match.params
    let { service, selectedAddress } = this.props
    let contractObj = service.contractObject(contract)
    let deployments = service.deployedContractObjects(contract)

    if (!contractObj) {
      return null
    }
    const header = {
      name: `Selected Contract`,
      color: `6025AE`,
      value: contract,
    }
    const rows = [
      {
        name: `ABI`,
        url: `https://ipfs.xyo.network/ipfs/${contractObj.ipfs}`,
        value: contractObj.ipfs,
      },
    ]
    if (selectedAddress) {
      rows.push({
        name: `Selected Address`,
        value: selectedAddress,
      })
    }
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
          <ResultTable header={header} rows={rows} />

          {this.deploymentsTable(deployments)}
        </Div>
      </Div>
    )
  }
}

export default SelectedContractDiv
