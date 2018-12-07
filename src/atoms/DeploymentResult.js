import React from "react"
import glam from "glamorous"

const ResultDiv = glam.div({
  display: `flex`,
  flexDirection: `column`,
  width: `70%`,
  minWidth: `650`,
  paddingLeft: 35,
  paddingTop: 30,
  fontSize: `25px`,
  fontFamily: `PT Sans`,
  color: `#4D4D5C`,
})

const RowDiv = glam.div({
  display: `flex`,
  flexDirection: `row`,
  justifyContent: `space-between`,
  height: 35,
  color: `#4D4D5C`,
  fontFamily: `PT Sans`,
  fontSize: 15,
})
const LeftColumn = glam.div({
  textAlign: `left`,
})
const RightColumn = glam.div({
  textAlign: `right`,
})
const DeploymentResult = ({ address, ipfs, name, notes }) => {
  if (!name) {
    return null
  }
  return (

    <ResultDiv>
      <RowDiv>
        <LeftColumn>Contract</LeftColumn>
        <RightColumn>{name}</RightColumn>
      </RowDiv>
      <RowDiv>
        <LeftColumn>IPFS Address</LeftColumn>
        <RightColumn>{ipfs}</RightColumn>
      </RowDiv>
      <RowDiv>
        <LeftColumn>Address</LeftColumn>
        <RightColumn>{address}</RightColumn>
      </RowDiv>
      <RowDiv>
        <LeftColumn>Notes</LeftColumn>
        <RightColumn>{notes}</RightColumn>
      </RowDiv>
    </ResultDiv>
  )
}
export default DeploymentResult
