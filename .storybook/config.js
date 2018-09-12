import { configure } from '@storybook/react'

function loadStories() {
  require('../src/atoms/stories')
}

configure(loadStories, module)
