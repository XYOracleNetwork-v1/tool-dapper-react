import React from 'react'
import glam, { Div } from 'glamorous'
import ResultTable from '../atoms/ResultTable'
const ReceiptRow = glam.div({
  display: 'flex',
  flexDirection: 'row',
  textAlign: 'right',
  width: 600,
})
const LeftColumn = glam.div({
  flex: 3,
  paddingRight: 10,
  textAlign: 'left',
})
const RightColumn = glam.div({
  textAlign: 'right',
  flex: 1,
  lineBreak: 'loose',
  wordWrap: 'break-word',
})
const nvc = (name, value, color = undefined) => {
  return { name: name, value: value, color: color }
}
export const Row = ({ name, value }) => (
  <ReceiptRow>
    <LeftColumn>{name}</LeftColumn>
    <RightColumn>{value}</RightColumn>
  </ReceiptRow>
)
export const eventDatas = event => {
  const { returnValues } = event
  const datas = []
  Object.entries(returnValues).forEach(([name, value]) => {
    if (isNaN(name)) {
      datas.push(nvc(name, value))
    }
  })
  return datas
}
export const EventTables = props => {
  const colors = ['#3071D1', '#6025AE', '#D19830']
  const { events } = props
  const eventTables = []
  let index = 0
  Object.entries(events).forEach(([name, event], v1, v2) => {
    let header = nvc('Event', name, colors[index % colors.length])
    let rows = eventDatas(event)
    eventTables.push(<ResultTable key={name} header={header} rows={rows} />)
    index++
  })
  return <Div>{eventTables}</Div>
}
export const TransactionReceipt = props => {
  const {
    transactionHash,
    // ethAddress,
    blockNumber,
    gasUsed,
    events,
  } = props
  if (!transactionHash) {
    return null
  }

  let header = nvc('Transaction Information', 'Values', '#D19830')
  let rows = [
    nvc('Transaction Hash', transactionHash),
    nvc('Block #', blockNumber),
    nvc('Gas Used', gasUsed),
    // nvc('Gas Price', gasPrice),
  ]
  return (
    <Div
      css={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
      }}
    >
      <Div
        css={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          width: '90%',
        }}
      >
        <ResultTable header={header} rows={rows} />
        <EventTables events={events} />
      </Div>
    </Div>
  )
}
