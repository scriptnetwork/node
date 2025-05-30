import { EToken } from 'utils/types/token';
import { KeyStore } from 'web3';

export type WalletType = {
    address: string;
};

export type WalletBalanceType = {
    [EToken.SPAY]: number;
    [EToken.SCPT]: number;
};

export interface IWalletBalance {
    data: {
        result: {
            coins: {
                scptwei: number;
                spaywei: number;
            };
        };
    };
}

export interface IWallet {
    address: string;
    privateKey: string;
}

export interface IInitialState {
    wallet: IWallet;
    unlockKey: string;
    isSidebarOpen: boolean;
    keyStore: KeyStore;
    balance: WalletBalanceType;
    firstLoginWallet: IWallet;
}