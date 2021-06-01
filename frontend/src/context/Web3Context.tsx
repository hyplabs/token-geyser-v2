import { API, Wallet } from 'bnc-onboard/dist/src/interfaces';
import Onboard from 'bnc-onboard';
import React, { createContext, useCallback, useEffect, useState } from 'react';
import { ethers, Signer } from 'ethers'

class Provider extends ethers.providers.Web3Provider {};

const Web3Context = createContext<{
  address?: string;
  wallet?: Wallet;
  onboard?: API;
  provider?: Provider;
  signer?: Signer;
  selectWallet: () => Promise<boolean>;
  ready: boolean;
}>({
  selectWallet: async () => false,
  ready: false,
});

interface Subscriptions {
  wallet: (wallet: Wallet) => void;
  address: React.Dispatch<React.SetStateAction<string | undefined>>;
}

const initOnboard = (subscriptions: Subscriptions): API => {
  const network = process.env.NODE_ENV === 'development'
    ? { networkId: 1337, networkName: 'localhost' }
    : { networkId: 1 }; // mainnet

  return Onboard({
    ...network,
    subscriptions,
  });
}

const Web3Provider: React.FC = ({ children }) => {
  const [address, setAddress] = useState<string>();
  const [wallet, setWallet] = useState<Wallet>();
  const [onboard, setOnboard] = useState<API>();
  const [provider, setProvider] = useState<Provider>();
  const [signer, setSigner] = useState<Signer>();
  const [ready, setReady] = useState(false);

  const updateWallet = useCallback((newWallet: Wallet) => {
    setWallet(newWallet)
    if (newWallet && newWallet.name) localStorage.setItem('selectedWallet', newWallet.name)
    const network = process.env.NODE_ENV === 'development' ? { name: 'localhost', chainId: 1337 } : undefined
    const ethersProvider = new Provider(newWallet.provider, network)
    const rpcSigner = ethersProvider.getSigner()
    setSigner(rpcSigner)
    setProvider(ethersProvider)
  }, [])

  useEffect(() => {
    const onboardAPI = initOnboard({
      address: setAddress,
      wallet: (w: Wallet) => {
        if (w?.provider?.selectedAddress) {
          updateWallet(w)
        } else {
          // TODO: favour using nulls over undefined when explicitly set
          setProvider(undefined)
          setWallet(undefined)
        }
      },
    })
    setOnboard(onboardAPI)
  }, [updateWallet]);

  useEffect(() => {
    ;(async () => {
      const previouslySelectedWallet = localStorage.getItem('selectedWallet')
      if (previouslySelectedWallet && onboard) {
        const walletSelected = await onboard.walletSelect(previouslySelectedWallet)
        setReady(walletSelected)
      }
    })()
  }, [onboard])

  const selectWallet = async (): Promise<boolean> => {
    if (!onboard) return false;
    const walletSelected = await onboard.walletSelect();
    if (!walletSelected) return false;
    const isReady = await onboard.walletCheck()
    setReady(isReady)
    if (isReady) updateWallet(onboard.getState().wallet)
    return isReady
  }

  return (
    <Web3Context.Provider
      value={{
        address,
        wallet,
        onboard,
        provider,
        signer,
        selectWallet,
        ready,
      }}
    >
      {children}
    </Web3Context.Provider>
  )
}

export { Web3Provider };

export default Web3Context;
