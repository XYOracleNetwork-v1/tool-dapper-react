import React, { memo, useMemo } from 'react'
import glam, { Div } from 'glamorous'
import { usePrevious } from 'react-hanger'

import Dropdown from './Dropdown'

const GreyTopped = glam.div({
  paddingTop: 10,
  color: `#c8c8c8`,
})

const getOptionValue = val =>
  val.length > 20 ? `${val.substring(0, 20)}...` : val

const ContractAddressDropdown = ({
  onSelect,
  selectedNotes,
  selectedAddress,
  network,
  contract,
  getDeployedContractObjects,
}) => {
  const prevContract = usePrevious(contract)
  const contractObjects = useMemo(
    () => getDeployedContractObjects(contract) || [],
    [contract],
  )

  console.log({
    contractObjects,
    contract,
    prevContract,
    selectedNotes,
    selectedAddress,
  })

  const onSelect2 = ({ value }) => {
    const objToSelect = contractObjects.find(
      ({ address, notes }) => value === address || value === notes,
    )
    const { notes, address } = objToSelect
    console.log({ objToSelect })

    onSelect({ notes, address })
  }

  return (
    <Div
      css={{
        marginTop: 25,
      }}
    >
      {!contractObjects || contractObjects.length === 0 ? (
        <GreyTopped>Not deployed on {network.name}</GreyTopped>
      ) : (
        <Dropdown
          options={contractObjects.map(({ notes, address }) => {
            const value = notes || address
            const label = getOptionValue(value)
            return {
              value,
              label,
            }
          })}
          onChange={onSelect2}
          value={selectedNotes || selectedAddress}
          placeholder="Nothing Selected"
        />
      )}
    </Div>
  )
}

export default memo(
  ContractAddressDropdown,
  (prevProps, nextProps) =>
    Object.is(prevProps.contract, nextProps.contract) &&
    Object.is(prevProps.selectedNotes, nextProps.selectedNotes) &&
    Object.is(prevProps.selectedAddress, nextProps.selectedAddress),
)
