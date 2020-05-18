import React, { ForwardRefRenderFunction, forwardRef } from 'react'
import classNames from 'classnames'
import omit from 'omit.js'

import { tuple, Omit } from '../_util/type'
import SizeContext, { SizeType } from '../config-provider/sizeContext'
import Wave from '../_util/wave'
import { ConfigContext } from '../config-provider/context'

const ButtonTypes = tuple('default', 'primary', 'ghost', 'dashed', 'link')
export type ButtonType = typeof ButtonTypes[number] // ButtonTypes为元组，加上[number]返回为联合类型 'default' | 'primary' | 'ghost' | 'dashed' | 'link'
const ButtonShapes = tuple('circle', 'circle-outline', 'round')
export type ButtonShape = typeof ButtonShapes[number]
const ButtonHTMLTypes = tuple('submit', 'button', 'reset')
export type ButtonHTMLType = typeof ButtonHTMLTypes[number]

export interface BaseButtonProps {
  type?: ButtonType;
  icon?: React.ReactNode;
  shape?: ButtonShape;
  size?: SizeType;
  loading?: boolean;
  prefixCls?: string;
  className?: string;
  children?: React.ReactNode;
}

export type AnchorButtonProps = {
  href: string;
  target?: string;
  onClick?: React.MouseEventHandler<HTMLElement>;
} & BaseButtonProps & Omit<
  React.AnchorHTMLAttributes<any>, 'type' | 'onClick'
>

export type NativeButtonProps = {
  htmlType?: ButtonHTMLType;
  onClick?: React.MouseEventHandler<HTMLElement>;
} & BaseButtonProps & Omit<
  React.AnchorHTMLAttributes<any>, 'type' | 'onClick'
>

export type ButtonProps = Partial<AnchorButtonProps & NativeButtonProps>

const InternalButton: ForwardRefRenderFunction<undefined, ButtonProps> = (props, ref) => {

  const size = React.useContext(SizeContext)

  const { getPrefixCls } = React.useContext(ConfigContext)

  const buttonRef = (ref as any) || React.createRef<HTMLElement>()

  const { 
    prefixCls: customizePrefixCls,
    shape,
    size: customizeSize,
    className,
    loading,
    type,
    htmlType,
    children,
    ...rest
  } = props

  const handleClick = (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement, MouseEvent>) => {
    const { onClick } = props
    if (loading) {
      return
    }
    if (onClick) {
      (onClick as React.MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>)(e)
    }
  }

  let sizeCls = ''
  switch (customizeSize || size) {
    case 'large':
      sizeCls = 'lg'
      break
    case 'small':
      sizeCls = 'sm'
      break
    default:
      break
  }

  const prefixCls = getPrefixCls('btn', customizePrefixCls)


  const classes = classNames(prefixCls, className, {
    [`${prefixCls}-${type}`]: type,
    [`${prefixCls}-${shape}`]: shape,
    [`${prefixCls}-${sizeCls}`]: sizeCls
  });

  const kids = children

  const linkButtonRestProps = omit(rest as AnchorButtonProps, ['htmlType', 'loading'])

  if (linkButtonRestProps.href !== undefined) {
    return (
      <a {...linkButtonRestProps} className={classes} onClick={handleClick} ref={buttonRef}>
        {kids}
      </a>
    )
  }

  const buttonNode = (
    <button
      type={htmlType}
      className={classes}
      onClick={handleClick}
      ref={buttonRef}
    >
      {kids}
    </button>
  )

  if (type === 'link') {
    return buttonNode
  }

  return <Wave>{buttonNode}</Wave>
}

const Button = forwardRef<unknown, ButtonProps>(InternalButton)

Button.displayName = 'Button'

Button.defaultProps = {
  loading: false,
  htmlType: 'button' as ButtonProps['htmlType']
}

export default Button