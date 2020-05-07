import { render } from 'react-dom'
import Widget from './src/header/src'
import moduleConfig from './src/header/module'

const layoutElement = document.getElementById(moduleConfig.name)

render(<Widget />, layoutElement)
