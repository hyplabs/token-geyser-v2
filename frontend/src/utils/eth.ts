import { Contract, ethers } from 'ethers'
import { UFRG_INIT_BLOCK } from '../constants'

export const getDefaultProvider = () => ethers.getDefaultProvider()

export const loadHistoricalLogs = async (contract: Contract, eventName: string, startBlock = UFRG_INIT_BLOCK) => {
  const filter = contract.filters[eventName]()
  return contract.queryFilter(filter, startBlock, 'latest')
}
