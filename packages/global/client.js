import { render } from 'react-dom'
import Widget from './header/src'
const module = require('./header/module')

const layoutElement = document.getElementById(module.name)

render(<Widget />, layoutElement)
