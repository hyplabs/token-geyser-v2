import React, { useState } from 'react'
import styled from 'styled-components/macro'
import { GeyserStakeView } from './GeyserStakeView'
import { GeyserFirstOverlay } from '../styling/styles'
import { ToggleView } from './ToggleView'
import { GeyserView } from '../constants'
import { GeyserUnstakeView } from './GeyserUnstakeView'
import { StatsContainer } from './StatsContainer'

interface Props {}

export const GeyserFirstContainer: React.FC<Props> = () => {
  const [view, setView] = useState<GeyserView>(GeyserView.STAKE)
  const getToggleOptions = () => Object.values(GeyserView).map((v) => v.toString())
  const selectView = (option: string) => setView(option as GeyserView)

  return (
    <div className="flex flex-row justify-center">
      <div className="flex flex-col align-center" style={{ width: 'fit-content' }}>
        <StatsContainer />
        <Container>
          <GeyserFirstOverlay>
            <div className="py-4">
              <ToggleView options={getToggleOptions()} toggleOption={selectView} activeOption={view} />
            </div>
            {view === GeyserView.STAKE ? <GeyserStakeView /> : <GeyserUnstakeView />}
          </GeyserFirstOverlay>
        </Container>
      </div>
    </div>
  )
}

const Container = styled.div`
  text-align: center;
  margin: auto;
`
