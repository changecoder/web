import React, { Component } from 'react'
import { ConfigConsumer, ConfigSonsumerProps, CSPConfig } from '../config-provider/context'

export default class Wave extends Component<{ insertExtraNode?: boolean}> {

  private csp?: CSPConfig

  renderWave = ({ csp }: ConfigSonsumerProps) => {
    const { children } = this.props

    this.csp = csp

    return children
  }

  render () {
    return <ConfigConsumer>{this.renderWave}</ConfigConsumer>
  }
}