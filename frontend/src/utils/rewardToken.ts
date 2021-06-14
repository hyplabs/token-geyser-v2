import { Contract, Signer } from 'ethers'
import { formatUnits } from 'ethers/lib/utils'
import { RewardToken } from '../constants'
import { RewardSchedule, RewardTokenInfo } from '../types'
import { UFRAGMENTS_ABI } from './abis/UFragments'
import { UFRAGMENTS_POLICY_ABI } from './abis/UFragmentsPolicy'
import { getTotalRewardShares } from './ampleforth'
import { defaultTokenInfo, getTokenInfo } from './token'

export const defaultRewardTokenInfo = (): RewardTokenInfo => ({
  ...defaultTokenInfo(),
  getTotalRewards: async () => 0,
})

export const getRewardTokenInfo = async (tokenAddress: string, token: RewardToken, signer: Signer) => {
  switch (token) {
    case RewardToken.MOCK:
      return getMockToken(tokenAddress, signer)
    case RewardToken.AMPL:
      return getAMPLToken(tokenAddress, signer)
    default:
      throw new Error(`Handler for ${token} not found`)
  }
}

const getMockToken = async (tokenAddress: string, signer: Signer): Promise<RewardTokenInfo> => {
  const tokenInfo = await getTokenInfo(tokenAddress, signer)
  const getTotalRewards = async (rewardSchedules: RewardSchedule[]) =>
    rewardSchedules.reduce(
      (acc, schedule) => acc + parseFloat(formatUnits(schedule.rewardAmount, tokenInfo.decimals)),
      0,
    )
  return {
    ...tokenInfo,
    getTotalRewards,
  }
}

const getAMPLToken = async (tokenAddress: string, signer: Signer): Promise<RewardTokenInfo> => {
  const contract = new Contract(tokenAddress, UFRAGMENTS_ABI, signer)
  const tokenInfo = await getTokenInfo(tokenAddress, signer)
  const policyAddress: string = await contract.monetaryPolicy()
  const policy = new Contract(policyAddress, UFRAGMENTS_POLICY_ABI, signer)

  const totalSupply = await contract.totalSupply()
  const epoch = parseInt(await policy.epoch(), 10)

  const getTotalRewards = async (rewardSchedules: RewardSchedule[]) => {
    const totalRewardShares = await getTotalRewardShares(
      rewardSchedules,
      policyAddress,
      epoch,
      tokenInfo.decimals,
      signer,
    )
    return totalRewardShares * totalSupply
  }

  return {
    ...tokenInfo,
    getTotalRewards,
  }
}
