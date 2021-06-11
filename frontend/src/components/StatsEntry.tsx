import React from 'react'
import { StatsEntryBody, StatsEntryCurrency } from '../styling/styles'

interface Props {
  title: string
  body: string
  currency?: string
  className?: string
}

export const StatsEntry: React.FC<Props> = ({ title, body, currency, className }) => (
  <div className={className}>
    <p>{title}</p>
    <StatsEntryBody>
      {body}
      {currency && <StatsEntryCurrency>{` ${currency}`}</StatsEntryCurrency>}
    </StatsEntryBody>
  </div>
)
