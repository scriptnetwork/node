import React, { useEffect, useState } from 'react';
import { ESubRoutes } from 'routes/types';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from 'store';
import { useActions } from 'hooks/useActions';
import { Send, Wallet, NodeRunner, OnChain, Contract, Settings, Explore, Logout, Faucet } from 'assets/svg';
import { ESideBarTitles } from './types';
import dotool from 'dotool';
import { STATUS_ROUTE, SUB_ROUTES } from 'routes/consts';
import styles from './sidebar.module.scss';

export const Sidebar: React.FC = () => {
    const location = window.location.pathname;
    const [active, setActive] = useState<keyof typeof ESubRoutes | null>(null);

    const [sidebarItems, setSidebarItems] = useState<
        {
            icon: JSX.Element;
            title: ESideBarTitles;
            route: string;
        }[]
    >([
        { icon: <Wallet />, title: ESideBarTitles.Tokens, route: SUB_ROUTES.Tokens },
        { icon: <Send />, title: ESideBarTitles.Send, route: SUB_ROUTES.Send },
        { icon: <NodeRunner />, title: ESideBarTitles.NodeRunner, route: SUB_ROUTES.NodeRunner },
        { icon: <OnChain />, title: 'Stakes' as ESideBarTitles, route: SUB_ROUTES.Stakes },
        { icon: <Contract />, title: ESideBarTitles.Contract, route: SUB_ROUTES.Contract },
        { icon: <Settings />, title: ESideBarTitles.Settings, route: SUB_ROUTES.Settings },
        { icon: <Explore />, title: ESideBarTitles.Explore, route: SUB_ROUTES.Explore },
        { icon: <Logout />, title: ESideBarTitles.Logout, route: SUB_ROUTES.Logout },
    ]);

    const { isSidebarOpen, wallet } = useAppSelector((state) => state.wallet);
    const { setSidebarOpen, lockWallet } = useActions();
    const navigate = useNavigate();

    const navigation = (route: string): void => {
        if (!route.includes('https')) {
            if (route === ESubRoutes.Logout && wallet.address) {
                lockWallet();
                localStorage.clear();
                navigate(STATUS_ROUTE.notAuthorized);
            } else {
                navigate(`/wallet/${route}`);
            }
        } else {
            const url = route === ESubRoutes.Explore ? `${ESubRoutes.Explore}/${wallet.address}` : route;
            window.open(url, '_blank');
        }
    };

    useEffect(() => {
        if (dotool.NETWORK === 'testnet' && SUB_ROUTES) {
            const updatedSidebarItems = [...sidebarItems];
            updatedSidebarItems.splice(2, 0, { icon: <Faucet />, title: ESideBarTitles.Faucet, route: SUB_ROUTES.Faucet });
            setSidebarItems(updatedSidebarItems);
        }
    }, [dotool.NETWORK]);

    useEffect(() => {
        const splitedLocation = location.split('/');
        if (splitedLocation[1] === 'wallet') {
            setActive(splitedLocation.at(-1) as keyof typeof ESubRoutes);
            setSidebarOpen(false);
        }
    }, [location]);

    return (
        <div className={`${styles.sidebar} ${isSidebarOpen ? styles.open : ''}`}>
            {sidebarItems.map((item, index) => {
                const isMarginTopNeeded = (dotool.NETWORK === 'testnet' && index === 7) || (dotool.NETWORK === 'mainnet' && index === 6);
                return (
                    <div key={index} className={`${styles.sidebar_item} ${active === item.route ? styles.active : ''}`} style={isMarginTopNeeded ? { marginTop: '60px' } : {}} onClick={() => navigation(item.route)}>
                        {item.icon}
                        <p>{item.title}</p>
                    </div>
                );
            })}
        </div>
    );
};
