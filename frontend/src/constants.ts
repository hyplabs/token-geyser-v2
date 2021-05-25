import { NamedColors } from './styling/colors'

export enum VaultState {
  ACTIVE,
  STALE,
  INACTIVE,
}

export const VaultStateColors: Record<VaultState, string> = {
  [VaultState.ACTIVE]: NamedColors.APPLE,
  [VaultState.STALE]: NamedColors.SCHOOL_BUS_YELLOW,
  [VaultState.INACTIVE]: NamedColors.RED_ORANGE,
}

const second = 1000
export const POLL_INTERVAL = 5 * second
