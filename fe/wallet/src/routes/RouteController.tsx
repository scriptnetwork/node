import React, { ReactNode } from 'react';
import DefaultLayout from 'layouts/defaultLayout/DefaultLayout';
import { Navigate } from 'react-router-dom';
import { STATUS_ROUTE } from './consts';
import { useStoreWalletData } from 'hooks/useStoreWalletData';
import { useAppSelector } from 'store';

interface IRouteControllerProps {
    isPrivate?: boolean;
    children: ReactNode;
    path: string;
    hasLayout?: boolean;
}

export const RouteController: React.FC<IRouteControllerProps> = ({ children, isPrivate, path, hasLayout }) => {
    const location = window.location.pathname;
    const { wallet: localWallet } = useStoreWalletData();
    const { wallet: storeWallet } = useAppSelector((state) => state.wallet);
    const wallet = localWallet.address ? localWallet : storeWallet;
    
    if (path === '*' && location !== '/') <>{children}</>;

    if ((!wallet.address && isPrivate) || location === '/') return <Navigate to={STATUS_ROUTE.notAuthorized} />;

    if (wallet.address && !isPrivate) return <Navigate to={STATUS_ROUTE.authorized} />;

    return hasLayout ? <DefaultLayout>{children}</DefaultLayout> : <>{children}</>;
};
