import glam from 'glamorous'
import React from 'react'

import Button from './../atoms/Button'

export const MainDiv = glam.div({
  color: `#fff`,
  flex: 1,
  height: `100%`,
  width: `auto`,
  overflow: `auto`,
})

export const Horizontal = glam.div({
  display: `flex`,
  flexDirection: `row`,
})

export const Vertical = glam.div({
  display: `flex`,
  flexDirection: `vertical`,
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
  flexDirection: `column`,
  paddingBottom: `30px`,
  width: `100%`,
  flex: 1,
})

export const FunctionParamList = glam.div({
  display: `flex`,
  flexDirection: `column`,
  justifyContent: `flex-start`,
  paddingRight: 30,
  flex: 1,
})

export const ParamInputDiv = glam.div({
  marginTop: 8,
  display: `flex`,
  flexDirection: `column`,
  minWidth: 300,
})

export const ExecuteFunctionButton = glam(Button)({
  width: 260,
  marginTop: 30,
})
