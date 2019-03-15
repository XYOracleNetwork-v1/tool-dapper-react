import React from 'react'
import { Div } from 'glamorous'
import ResultTable from './ResultTable'

const nvc = (name, value, color) => ({ name, value, color })

export const eventDatas = ({ returnValues }) =>
  Object.entries(returnValues).reduce(
    (acc, [name, value]) => (isNaN(name) ? [...acc, nvc(name, value)] : acc),
    [],
  )

const colors = [`#3071D1`, `#6025AE`, `#D19830`]
export const EventTables = ({ events }) => (
  <Div>
    {Object.entries(events).map(([name, event], index) => (
      <ResultTable
        key={name}
        header={nvc(`Event`, name, colors[index % colors.length])}
        rows={eventDatas(event)}
      />
    ))}
  </Div>
)

export const TransactionReceipt = ({ transactionReceipt }) => {
  const {
    transactionHash,
    // ethAddress,
    blockNumber,
    gasUsed,
    events,
  } = transactionReceipt
  if (!transactionHash) {
    return null
  }

  const header = nvc(`Transaction Information`, `Values`, `#D19830`)
  const rows = [
    nvc(`Transaction Hash`, transactionHash),
    nvc(`Block #`, blockNumber),
    nvc(`Gas Used`, gasUsed),
    // nvc('Gas Price', gasPrice),
  ]

  return (
    <Div>
      <ResultTable header={header} rows={rows} />
      <EventTables events={events} />
    </Div>
  )
}
