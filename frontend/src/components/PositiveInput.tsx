import React from 'react'
import { Input } from '../styling/styles'

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  precision?: number
}

export const PositiveInput: React.FC<Props> = (props) => {
  const { onChange, precision } = props

  const respectsPrecision = (value: string) => {
    if (precision !== undefined) {
      const parts = value.split('.')
      return parts.length > 0 ? parts[1].length <= precision : true
    }
    return true
  }

  const positiveOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const pattern = new RegExp(`(^\\d+$|^\\d+\\.\\d+$|^\\d+\\.$|^$)`)
    const { value } = e.currentTarget
    if (onChange && pattern.test(value) && respectsPrecision(value)) {
      onChange(e)
    }
  }

  return <Input {...props} onChange={positiveOnChange} />
}
