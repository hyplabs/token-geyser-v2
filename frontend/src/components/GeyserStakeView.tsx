import { BigNumber } from 'ethers'
import { parseUnits } from 'ethers/lib/utils'
import React, { useContext, useEffect, useState } from 'react'
import { TransactionReceipt } from '@ethersproject/providers'
import { GeyserContext } from '../context/GeyserContext'
import { VaultContext } from '../context/VaultContext'
import { WalletContext } from '../context/WalletContext'
import Web3Context from '../context/Web3Context'
import { amountOrZero } from '../utils/amount'
import { PositiveInput } from './PositiveInput'
import { GeyserInteractionButton } from './GeyserInteractionButton'
import tw from 'twin.macro'
import styled from 'styled-components/macro'
import { UserBalance } from './UserBalance'
import { EstimatedRewards } from './EstimatedRewards'
import { ConnectWalletWarning } from './ConnectWalletWarning'

interface Props {}

export const GeyserStakeView: React.FC<Props> = () => {
  const [amount, setAmount] = useState<string>('')
  const [parsedAmount, setParsedAmount] = useState<BigNumber>(BigNumber.from('0'))
  const [receipt, setReceipt] = useState<TransactionReceipt>()
  const { selectedGeyser, stakingTokenInfo, handleGeyserAction, isStakingAction } = useContext(GeyserContext)
  const { decimals: stakingTokenDecimals, symbol: stakingTokenSymbol } = stakingTokenInfo
  const { signer } = useContext(Web3Context)
  const { selectedVault, currentLock } = useContext(VaultContext)
  const { walletAmount, refreshWalletAmount } = useContext(WalletContext)
  const { selectWallet, address } = useContext(Web3Context)
  const currentStakeAmount = BigNumber.from(currentLock ? currentLock.amount : '0')

  const refreshInputAmount = () => {
    setAmount('')
    setParsedAmount(BigNumber.from('0'))
  }

  useEffect(() => {
    refreshInputAmount()
    refreshWalletAmount()
  }, [receipt])

  useEffect(() => {
    refreshInputAmount()
  }, [isStakingAction])

  const handleGeyserInteraction = async () => setReceipt(await handleGeyserAction(selectedVault, parsedAmount))

  const handleOnChange = (value: string) => {
    setAmount(value)
    if (selectedGeyser && signer) {
      setParsedAmount(parseUnits(amountOrZero(value).toString(), stakingTokenDecimals))
    }
  }

  return (
    <GeyserStakeViewContainer>
      <UserBalance
        parsedAmount={parsedAmount}
        currentAmount={isStakingAction ? walletAmount : currentStakeAmount}
        decimals={stakingTokenDecimals}
        symbol={stakingTokenSymbol}
        isStakingAction={isStakingAction}
      />
      <PositiveInput
        placeholder="Enter amount"
        value={amount}
        onChange={handleOnChange}
        precision={stakingTokenDecimals}
        maxValue={isStakingAction ? walletAmount : currentStakeAmount}
      />
      <EstimatedRewards />
      {!address && <ConnectWalletWarning onClick={selectWallet} />}
      <GeyserInteractionButton
        disabled={!address}
        onClick={handleGeyserInteraction}
        displayText={isStakingAction ? `Stake` : `Unstake`}
      />
    </GeyserStakeViewContainer>
  )
}

const GeyserStakeViewContainer = styled.div`
  ${tw`m-6 mb-7 min-h-300px flex flex-col`}
`
