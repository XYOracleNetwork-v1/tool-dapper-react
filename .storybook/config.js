import { configure } from '@storybook/react'

function loadStories() {
  require('../src/components/atoms/stories')
}

configure(loadStories, module)
