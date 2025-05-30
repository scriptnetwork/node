import { useEffect, useState } from 'react';
import { useActions } from './useActions';
import { ethers } from 'ethers';
import { KeyStore, Web3Account } from 'web3';

export const useStoreWalletData = (): { wallet: Web3Account | ethers.Wallet; keystore: KeyStore } => {
    const { setWalletAddress, setWalletData, setKeyStore } = useActions();
    const [wallet, setWallet] = useState<Web3Account | ethers.Wallet>({} as Web3Account | ethers.Wallet);
    const [keystore, setKeystore] = useState<KeyStore>({} as KeyStore);

    useEffect(() => {
        const wallet = localStorage.getItem('wallet');
        const keystore = localStorage.getItem('keystore');

        if (wallet && keystore) {
            setWalletAddress(JSON.parse(wallet).address);
            setWalletData(JSON.parse(wallet));
            setKeyStore(JSON.parse(keystore));
            setWallet(JSON.parse(wallet));
            setKeystore(JSON.parse(keystore));
        }
    }, []);

    return { wallet, keystore };
};
