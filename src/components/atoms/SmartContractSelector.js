import React, { memo, useMemo } from 'react'

import Dropdown from './Dropdown'

const SmartContractSelector = ({
  onSelect,
  contracts,
  contract: selectedContract,
  history,
}) => {
  const options = useMemo(
    () => contracts.map(({ name }) => ({ value: name, label: name })),
    [contracts],
  )
  const select = selection => {
    history.push(`/simulator/${selection.label}`)
    onSelect(selection)
  }
  console.log(`Selected`, contracts, options, selectedContract)
  return (
    <Dropdown
      css={{
        height: 60,
        fontFamily: `PT Sans`,
      }}
      options={options}
      onChange={select}
      value={selectedContract}
      placeholder="Select Contract"
    />
  )
}

export default memo(
  SmartContractSelector,
  (prevProps, nextProps) =>
    Object.is(prevProps.contract, nextProps.contract) &&
    prevProps.contracts.length === nextProps.contracts.length,
)
