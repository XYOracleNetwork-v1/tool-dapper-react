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
        background: 'transparent',
        border: '2px solid currentColor',
        height: 40,
        color: 'currentColor',
        cursor: 'pointer',
        textDecoration: 'none',
        padding: '0 1em',
        textAlign: 'center',
        width: '100%',
        outline: 'none',
        borderRadius: 25,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition:
          'background-color 0.3s, width 0.3s, border-width 0.3s, border-color 0.3s, border-radius 0.3s',
        '& span': {
          display: 'inherit',
          transition: 'opacity 0.3s 0.1s',
          fontSize: '2em',
          fontWeight: 100,
        },
        '& svg': {
          width: 40,
          height: 40,
          position: 'absolute',
          pointerEvents: 'none',
          transform: 'rotate(0deg)',
          '& path': {
            opacity: 0,
            fill: 'none',
          },
          '&.pb-progress-circle': {
            animation: `${spin} 0.9s infinite cubic-bezier(0.085, 0.26, 0.935, 0.71)`,
            '& path': {
              stroke: 'currentColor',
              strokeWidth: 5,
            },
          },
          '&.pb-checkmark, &.pb-cross': {
            '& path': {
              stroke: '#fff',
              strokeLinecap: 'round',
              strokeWidth: 4,
            },
          },
        },
      },
      '&.disabled': {
        '& .pb-button': { cursor: 'not-allowed' },
      },
      '&.loading': {
        '& .pb-button': {
          width: 40,
          borderWidth: 6.5,
          borderColor: '#ddd',
          cursor: 'wait',
          backgroundColor: 'transparent',
          padding: 0,
          '& span': {
            transition: 'all 0.15s',
            opacity: 0,
            display: 'none',
          },
          '& .pb-progress-circle > path': {
            transition: 'opacity 0.15s 0.3s',
            opacity: 1,
          },
        },
      },
      '&.success': {
        '& .pb-button': {
          borderColor: '#a0d468',
          backgroundColor: '#a0d468',
          '& span': {
            transition: 'all 0.15s',
            opacity: 0,
            display: 'none',
          },
          '& .pb-checkmark > path': { opacity: 1 },
        },
      },
      '&.error': {
        '& .pb-button': {
          borderColor: '#ed5565',
          backgroundColor: '#ed5565',
          '& span': {
            transition: 'all 0.15s',
            opacity: 0,
            display: 'none',
          },
          '& .pb-cross > path': { opacity: 1 },
        },
      },
    },
  },
  ({ css = {} }) => ({
    '.pb-container': css,
  }),
)

export default Btn
