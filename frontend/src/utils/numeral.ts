import numeral from 'numeral-es6'
import { DAY_IN_SEC, HOUR_IN_SEC, MIN_IN_SEC, MONTH_IN_SEC, WEEK_IN_SEC } from '../constants'

export const safeNumeral = (n: number, f: string): string => {
  const safeNum: string = numeral(n).format(f)
  return safeNum === 'NaN' ? numeral(0).format(f) : safeNum
}

export const humanReadableDuration = (duration: number) => {
  const durationLabel = [
    {
      duration: MONTH_IN_SEC,
      label: 'month',
    },
    {
      duration: WEEK_IN_SEC,
      label: 'week',
    },
    {
      duration: DAY_IN_SEC,
      label: 'day',
    },
    {
      duration: HOUR_IN_SEC,
      label: 'hour',
    },
    {
      duration: MIN_IN_SEC,
      label: 'minute',
    },
    {
      duration: 1,
      label: 'second',
    },
  ]

  const index =
    (durationLabel.findIndex(({ duration: d }) => duration >= d) + durationLabel.length) % durationLabel.length
  const { duration: d, label } = durationLabel[index]
  const n = duration / d
  return {
    numeral: safeNumeral(n, '0'),
    units: `${label}${n > 1 ? 's' : ''}`,
  }
}
