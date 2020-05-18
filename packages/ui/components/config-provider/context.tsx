import React, { createContext } from 'react'

export interface CSPConfig {
  nonce?: string;
}

export interface ConfigSonsumerProps {
  getPrefixCls: (suffixCls: string, customizePrefixCls?: string) => string;
  csp?: CSPConfig;
}

export const ConfigContext = createContext({
  getPrefixCls: (suffixCls: string, customizePrefixCls?: string) => {
    if (customizePrefixCls) return customizePrefixCls
    return suffixCls ? `ccui-${suffixCls}` : 'ccui'
  }
})

export const ConfigConsumer = ConfigContext.Consumer