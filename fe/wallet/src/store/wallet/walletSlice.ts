import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ethers } from 'ethers';
import { KeyStore, Web3Account } from 'web3';
import { IInitialState, IWallet, IWalletBalance, WalletBalanceType } from './walletTypes';
import { walletService } from './walletService';
import { EToken } from 'utils/types/token';

const initialState: IInitialState = {
    wallet: {} as Web3Account | ethers.Wallet,
    unlockKey: '',
    isSidebarOpen: false,
    keyStore: {} as KeyStore,
    balance: {} as WalletBalanceType,
    firstLoginWallet: {} as Web3Account | ethers.Wallet,
};

const walletSlice = createSlice({
    name: 'wallet',
    initialState,
    reducers: {
        setWalletAddress: (state: IInitialState, action: PayloadAction<string>) => {
            state.wallet.address = action.payload;
        },
        setWalletData: (state: IInitialState, action: PayloadAction<IWallet>) => {
            state.wallet.address = action.payload.address;
            state.wallet.privateKey = action.payload.privateKey;
        },
        setUnlockKey: (state: IInitialState, action: PayloadAction<string>) => {
            state.unlockKey = action.payload;
        },
        toggleSidebar: (state: IInitialState) => {
            state.isSidebarOpen = !state.isSidebarOpen;
        },
        setSidebarOpen: (state: IInitialState, action: PayloadAction<boolean>) => {
            state.isSidebarOpen = action.payload;
        },
        setKeyStore: (state: IInitialState, action: PayloadAction<KeyStore>) => {
            state.keyStore = action.payload;
        },
        setOneTimeWallet: (state: IInitialState, action: PayloadAction<Web3Account | ethers.Wallet>) => {
            state.firstLoginWallet = action.payload;
        },
        lockWallet: (state: IInitialState) => {
            state.wallet = {} as Web3Account | ethers.Wallet;
            state.unlockKey = '';
            state.keyStore = {} as KeyStore;
        },
    },
    extraReducers: (builder: { addCase: (arg0: any, arg1: (state: IInitialState, action: PayloadAction<IWalletBalance>) => void) => void }) => {
        builder.addCase(walletService.getWalletBalance.fulfilled, (state: IInitialState, action: PayloadAction<IWalletBalance>) => {
            if (!action.payload.data.result) return;
            state.balance = {
                [EToken.SCPT]: +ethers.utils.formatUnits(action.payload.data.result.coins.scptwei, 18),
                [EToken.SPAY]: +ethers.utils.formatUnits(action.payload.data.result.coins.spaywei, 18),
            };
        });
    },
});

export const walletActions = walletSlice.actions;
export default walletSlice.reducer;
