import React from 'react';
import glam, { Div } from 'glamorous'

const ReceiptRow = glam.div({
  display: 'flex',
  flexDirection:'row',
  textAlign: 'right',
  width: 600,
})
const LeftColumn = glam.div({
  flex: 3,
  paddingRight:10,
  textAlign: 'left',

})
const RightColumn = glam.div({
  textAlign: 'right',
  flex: 1,
  lineBreak: 'loose',
  wordWrap: 'break-word'
})
const HeaderRow = glam.div({
  fontWeight:800,
  paddingTop:10,
})
export const Row = ({name, value}) => {
  return <ReceiptRow>
      <LeftColumn>
        {name}
      </LeftColumn>
      <RightColumn>
        {value}
      </RightColumn>
    </ReceiptRow>
}
export const EventValues = (props) => {
  const {returnValues} = props
  console.log("HMMMMM", JSON.stringify(returnValues))

  // if (!returnValues || !returnValues.length > 0) {
  //   return null
  // }
  // return <Row name={`Event Data`} value={JSON.stringify(returnValues)} />
  //TODO Parse Event data
  let divs = []
  for (const [ index, value ] of Object.entries(returnValues)) {
    console.log("WAT", index, value)
    divs.push(
      <Div key={index}>
        <Row name={index} value={value} />
      </Div>
    )
  }
  return <Div>{divs}</Div>
}
export const Events = (props) => {
  const {events} = props
  let eventDivs = []
  for (const [ name, event ] of Object.entries(events)) {
    eventDivs.push(
    <Div key={name} >
    <HeaderRow>
      <Row name='Event Name' value={name} />
    </HeaderRow>
    <EventValues {...event} />
    </Div>
    )
  }    
  
  return <Div>{eventDivs}</Div>
}
export const TransactionReceipt = (props) => {
  console.log("SHowing tx receipt", props)
  const {transactionHash, ethAddress, blockNumber, gasUsed, gasPrice, events} = props
    if (!transactionHash) { return null }
     
    return <Div bordered responsive css={{textAlign: 'left'}}>
          <HeaderRow>
            <Row name='Transaction Information' value="Values" />
          </HeaderRow>
          <Row name="Contract Address" value={ethAddress} />
          <Row name="TX #" value={transactionHash} />
          <Row name="Block #" value={blockNumber} />
          <Row name="Gas Used" value={gasUsed} />
          <Row name="Gas Price" value={gasPrice} />
          
          <Events events={events} />
      </Div>
  
  }