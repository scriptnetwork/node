import { RootState } from '../index';

const walletState = (state: RootState) => state.wallet.wallet;

export const wallet = { walletState };
