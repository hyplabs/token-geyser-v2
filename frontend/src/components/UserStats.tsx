import React, { useContext } from 'react'
import { GeyserContext } from '../context/GeyserContext'
import { StatsContext } from '../context/StatsContext'
import { StatsTitle } from '../styling/styles'
import { StatsEntry } from './StatsEntry'

export const UserStats: React.FC = () => {
  const { userStats: { apy, currentMultiplier, currentReward }, vaultStats: { platformTokenBalances } } = useContext(StatsContext)
  const { platformTokenInfos, rewardTokenInfo: { symbol: rewardTokenSymbol } } = useContext(GeyserContext)

  // currently assumes that platformTokenBalances.length <= 1
  // it is theoretically possible that platformTokenBalances.length > 1, but as of right now,
  // none of the geysers support this

  return (
    <div className="flex-1 ml-4 mb-4 p-4 grid grid-cols-2 gap-y-4">
      <StatsTitle> MY STATS </StatsTitle>
      <StatsEntry title="APY" body={`${apy.toFixed(2)}%`} className="col-span-2" />
      <StatsEntry title="Reward Multiplier" body={`${currentMultiplier.toFixed(1)}x`} className="col-span-2" />
      <StatsEntry title="Current Rewards" body={`${currentReward.toFixed(2)}`} currency={rewardTokenSymbol} className="col-span-2 sm:col-span-1" />
      {platformTokenBalances.length > 0 &&
        <StatsEntry title="External Rewards" body={`${platformTokenBalances[0].toFixed(2)}`} currency={platformTokenInfos[0].symbol} className="col-span-2 sm:col-span-1" />}
    </div>
  )
}
