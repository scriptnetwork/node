import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosApi from 'config/axiosApi';
import { WALLET_API } from 'store/endpoints';
import errorHandler from 'utils/errors/errorHandler';
import { IWalletBalance } from './walletTypes';

const getWalletBalance = createAsyncThunk('/tenant/user/login', async (payload: { wallet: string }, thunkAPI) => {
    try {
        const { data }: { data: IWalletBalance } = await axiosApi.post(WALLET_API.GET_BALANCE, { wallet: payload.wallet });

        return thunkAPI.fulfillWithValue(data);
    } catch (error) {
        return thunkAPI.rejectWithValue(errorHandler(error));
    }
});

export const walletService = { getWalletBalance };
