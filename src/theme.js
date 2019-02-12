import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

export const lightPurple = '#ad6fff'

/**
 * Hello fellow developer from the future! You may be an older version of me, so I will explain how this border works,
 * like you're five.
 *
 * First, some definitions:
 * TL: top-left
 * TR: top-right
 * BL: bottom-left
 * BR: bottom-right
 *
 * SP: starting-point (where the "pen" is placed on the paper)
 * EP: ending-point (where the "pen" is lifted from the paper)
 *
 * GL: gap-length, length in pixels of the gap between "dashes"
 * LL: line-length, length in pixels of each "dash"
 * BW: the width of the border, also known as stroke-width
 *
 * Second, this is how the border is being drawn:
 * ---->              ---->|
 * ^    ^-TLEP   TRSP-^    |
 * | <- TLSP       TREP -> V
 *
 *
 *
 *
 *
 * ^ <- BLEP       BRSP -> |
 * |    V- BLSP  BREP -V   V
 * |<----              <----
 *
 * Imagine drawing a square, except instead of starting in a corner, you start at the end of
 * one of the edges, and instead of drawing a continuous square, you lift your pen up for a certain length
 * of all four edges.
 *
 * Finally, since we're in math world, here's some simple math equations:
 *
 * Total width/height (defined as totalSize below): GL + 2 * LL
 * Line-length: half of the dash-length, since the border is "tiled" (i.e., a dash consists of the
 *              line formed by two tiles together)
 * Half stroke-width: half of the border-width.
 *                    SVG coordinates draw the stroke from the center, so we need to account for this
 * Adjusted line-length: line-length minus half of the stroke-width.
 *                       how long the stroke is, taking into account the above fact
 *
 * @param color: color of the border, hex or string. Default: white
 * @param dashLength: length of the dash. Default: 20
 * @param gapLength: length of the gap between dashes. Default: 20
 * @param borderWidth: width of the border. Default: 2.
 * @returns {string}
 */

export const createBorder = ({
  color = 'white',
  dashLength = 20,
  gapLength = 20,
  borderWidth = 2,
}) => {
  const prepend = `data:image/svg+xml;utf8,`
  const lineLength = dashLength / 2
  const totalSize = gapLength + 2 * lineLength
  const halfStroke = borderWidth / 2
  const adjLineLength = lineLength - halfStroke // for drawing line to line
  const oppo = totalSize - lineLength
  const oppo2 = totalSize - halfStroke
  const s = `
<svg
  xmlns="http://www.w3.org/2000/svg"
  fill="none"
  stroke="${color}"
  stroke-width="${borderWidth}px"
  stroke-linecap="butt"
  width="${totalSize}px"
  height="${totalSize}px"
  viewBox="0 0 ${totalSize} ${totalSize}"
>
  <path d="M${halfStroke},${lineLength}v${-adjLineLength}h${adjLineLength}" />
  <path d="M${oppo},${halfStroke}h${adjLineLength}v${adjLineLength}" />
  <path d="M${oppo2},${oppo}v${adjLineLength}h${-adjLineLength}" />
  <path d="M${lineLength},${oppo2}h${-adjLineLength}v${-adjLineLength}" />
</svg>
`.replace(/\r?\n|\r/g, '')
  return `url('${prepend}${s}') ${borderWidth} round`
}
