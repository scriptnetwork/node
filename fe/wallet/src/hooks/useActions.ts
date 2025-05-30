import { bindActionCreators } from '@reduxjs/toolkit';

import { walletService } from 'store/wallet/walletService';
import { walletActions } from 'store/wallet/walletSlice';

import { useAppDispatch } from '../store';

const actions = {
    ...walletService,
    ...walletActions,
};

export const useActions = () => {
    const dispatch = useAppDispatch();

    return bindActionCreators(actions, dispatch);
};
