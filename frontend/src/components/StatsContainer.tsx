import React from 'react'
import { GeyserFirstOverlay, VerticalLine } from '../styling/styles'
import { GeyserStats } from './GeyserStats'
import { UserStats } from './UserStats'

export const StatsContainer: React.FC = () => (
  <GeyserFirstOverlay className="flex flex-row relative mt-12 w-auto sm:w-650">
    <UserStats />
    <VerticalLine />
    <GeyserStats />
  </GeyserFirstOverlay>
)
