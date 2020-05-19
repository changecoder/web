import React, { Component } from 'react'
import { ConfigConsumer } from '../config-provider/context'

export default class Wave extends Component<{ insertExtraNode?: boolean}> {

  renderWave = () => {
    const { children } = this.props

    return children
  }

  render () {
    return <ConfigConsumer>{this.renderWave}</ConfigConsumer>
  }
}