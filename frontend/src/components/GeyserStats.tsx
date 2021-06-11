import React, { useContext } from 'react'
import { DAY_IN_SEC } from '../constants'
import { GeyserContext } from '../context/GeyserContext'
import { StatsContext } from '../context/StatsContext'
import { StatsTitle } from '../styling/styles'
import { StatsEntry } from './StatsEntry'

export const GeyserStats: React.FC = () => {
  const { geyserStats: { duration, totalDeposit, totalRewardsClaimed } } = useContext(StatsContext)
  const { rewardTokenInfo: { symbol }} = useContext(GeyserContext)

  return (
    <div className="flex-1 ml-4 mb-4 p-4 grid grid-cols-1 gap-y-2">
      <StatsTitle> GEYSER </StatsTitle>
      <StatsEntry title="Program Duration" body={(duration / DAY_IN_SEC).toFixed(1)} />
      <StatsEntry title="Total Deposits" body={totalDeposit.toFixed(2)} currency="USD" />
      <StatsEntry title="Total Rewards" body={totalRewardsClaimed.toFixed(2)} currency={symbol} />
    </div>
  )
}
