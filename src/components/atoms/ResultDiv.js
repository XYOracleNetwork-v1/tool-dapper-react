import React, { useRef } from 'react'
import { H2, Div } from 'glamorous'
import { useOnMount } from 'react-hanger'
import PerfectScrollbar from 'perfect-scrollbar'

import { lightPurple } from '../../theme'

const ResultDiv = ({ children, title }) => {
  const resultDiv = useRef()
  useOnMount(() => {
    resultDiv.current = new PerfectScrollbar(`.result-div`)
  })
  return (
    <Div
      css={{
        padding: '10px 0',
        fontSize: 18,
      }}
    >
      <H2 css={{ color: lightPurple }}>{title}</H2>
      <div className="result-div">{children}</div>
    </Div>
  )
}

export default ResultDiv
