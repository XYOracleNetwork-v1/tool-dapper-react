import React from 'react'
import { keyframes } from 'glamor'
import glam from 'glamorous'
import ProgressButton from 'react-progress-button'

const spin = keyframes({
  '0%': {
    transform: 'rotate(0deg)',
  },
  '100%': {
    transform: 'rotate(360deg)',
  },
})

const Btn = glam(ProgressButton)(
  {
    '.pb-container': {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 200,
      '& .pb-button': {
        height: 40,
        borderRadius: 25,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        '& svg': {
          width: 40,
          height: 40,
          transform: 'rotate(0deg)',
          '&.pb-progress-circle': {
            animationName: spin,
          },
        },
      },
      '&.loading': {
        '& .pb-button': {
          width: 40,
        },
      },
    },
  },
  ({ css = {} }) => ({
    '.pb-container': css,
  }),
)

export default Btn
