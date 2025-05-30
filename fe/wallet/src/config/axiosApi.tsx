import { ReactNode, useEffect } from 'react';

import axios, { AxiosError, AxiosResponse } from 'axios';
import { useNavigate } from 'react-router-dom';
import { ROUTE_PATHS } from 'routes/consts';
import dotool from 'dotool';

interface Props {
    children: ReactNode;
}

const baseUrl = dotool.BE_WALLET_URL;

const axiosApi = axios.create({
    withCredentials: true,
    baseURL: baseUrl,
    headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
    },
    timeout: 5000,
});

const getLocalAccess = () => {
    const account = localStorage.getItem('account');

    return account;
};

axiosApi.interceptors.request.use(
    async (config) => {
        const account = getLocalAccess();
        if (account) {
            config.headers['authorization'] = `Account: ${account}`;
        }

        return config;
    },
    (error) => Promise.reject(error),
);

export const AxiosInterceptor: React.FC<Props> = ({ children }: Props) => {
    const navigate = useNavigate();
    useEffect(() => {
        const resInterceptor = (response: AxiosResponse) => {
            return response;
        };
        const errInterceptor = (error: AxiosError) => {
            if (error.response && error.response.status === 401) {
                localStorage.removeItem('account');
                navigate(ROUTE_PATHS.UNLOCK_WALLET);
            }

            return Promise.reject(error);
        };
        const interceptor = axiosApi.interceptors.response.use(resInterceptor, errInterceptor);

        return () => axiosApi.interceptors.response.eject(interceptor);
    }, []);

    return <>{children}</>;
};

export default axiosApi;
