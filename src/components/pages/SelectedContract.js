import React from 'react'
import { Div } from 'glamorous'
import ResultTable from '../atoms/ResultTable'

const DeploymentsTable = ({ deployments, getNetworkNamed }) => {
  if (!deployments || !deployments.length) return null
  const header = { name: 'Network', value: 'Address' }
  const rows = deployments.reduce((acc, dep) => {
    const net = getNetworkNamed(dep.netId)
    if (!net) return acc
    const network = net.name
    const address = dep.notes ? dep.notes + ` - ` + dep.address : dep.address
    return [...acc, { name: network, value: address }]
  }, [])
  return (
    <Div>
      <h3>Deployments</h3>
      <ResultTable header={header} rows={rows} />
    </Div>
  )
}

const SelectedContract = ({
  service,
  selectedAddress,
  match: {
    params: { contract },
  },
}) => {
  const contractObj = service.contractObject(contract)
  const deployments = service.deployedContractObjects(contract)

  if (!contractObj) {
    return null
  }
  const header = {
    name: `Selected Contract`,
    value: contract,
  }
  const rows = [
    {
      name: `ABI`,
      url: `https://ipfs.xyo.network/ipfs/${contractObj.ipfs}`,
      value: contractObj.ipfs,
    },
    selectedAddress && {
      name: `Selected Address`,
      value: selectedAddress,
    },
  ].filter(Boolean)

  return (
    <Div>
      <ResultTable header={header} rows={rows} />
      <DeploymentsTable
        deployments={deployments}
        getNetworkNamed={service.getNetworkNamed}
      />
    </Div>
  )
}

export default SelectedContract
