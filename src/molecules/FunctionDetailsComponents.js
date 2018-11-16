import glam from "glamorous"

export const MainDiv = glam.div({
  color: `#4D4D5C`,
  fontFamily: `PT Sans`,
  flex: 1,
  height: `100%`,
  overflow: `auto`,
})

export const FunctionPropertiesDiv = glam.div({
  display: `flex`,
  flexDirection: `column`,
  justifyContent: `flexStart`,
  lineHeight: `30px`,
  paddingLeft: `20px`,
  fontSize: `16px`,
  minWidth: 250,
})

export const FunctionParamLayout = glam.div({
  display: `flex`,
  flexDirection: `row`,
  paddingBottom: `30px`,
  borderBottom: `1px solid #979797`,
  width: `100%`,
  flex: 1,
})
export const FunctionParamList = glam.div({
  display: `flex`,
  flexDirection: `column`,
  justifyContent: `flex-start`,
  paddingLeft: 30,
  paddingRight: 30,
  flex: 1,
})

export const InputBar = glam.input({
  marginTop: 8,
  marginRight: 8,
  paddingLeft: 8,
  border: `1px solid #E0E0E0`,
  borderRadius: `6px`,
  backgroundColor: `#F6F6F6`,
  height: 40,
  flex: 1,
})

export const ParamInputDiv = glam.div({
  marginTop: 8,
  display: `flex`,
  flexDirection: `column`,
  minWidth: 300,
})

