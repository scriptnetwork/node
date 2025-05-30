import React, { useEffect, useState } from 'react';
import { IDefaultLayout } from '../../utils/types/layout';
import { Header } from 'components/molecules/header/Header';
import { Sidebar } from 'components/molecules/sidebar/Sidebar';
import { Footer } from 'components/molecules/footer/Footer';
import { ESideBarTitles } from 'components/molecules/sidebar/types';
import { useAppSelector } from 'store';
import { Wallet, Send, NodeRunner, OnChain, Contract, Settings, Explore, Logout, Faucet } from 'assets/svg';
import { useActions } from 'hooks/useActions';
import { SUB_ROUTES } from 'routes/consts';
import styles from './defaultLayout.module.scss';

const DefaultLayout: React.FC<IDefaultLayout> = ({ children }) => {
    const location = window.location.pathname;
    const [active, setActive] = useState<ESideBarTitles>(ESideBarTitles.Tokens);
    const { wallet } = useAppSelector((state) => state.wallet);
    const { getWalletBalance } = useActions();

    const SIDE_BAR_ITEMS = [
        { icon: <Wallet />, title: ESideBarTitles.Tokens, route: SUB_ROUTES.Tokens },
        { icon: <Send />, title: ESideBarTitles.Send, route: SUB_ROUTES.Send },
        { icon: <Faucet />, title: ESideBarTitles.Faucet, route: SUB_ROUTES.Faucet },
        { icon: <NodeRunner />, title: ESideBarTitles.NodeRunner, route: SUB_ROUTES.NodeRunner },
        { icon: <OnChain />, title: 'Stakes' as ESideBarTitles, route: SUB_ROUTES.Stakes },
        { icon: <Contract />, title: ESideBarTitles.Contract, route: SUB_ROUTES.Contract },
        { icon: <Settings />, title: ESideBarTitles.Settings, route: SUB_ROUTES.Settings },
        { icon: <Explore />, title: ESideBarTitles.Explore, route: SUB_ROUTES.Explore },
        { icon: <Logout />, title: ESideBarTitles.Logout, route: SUB_ROUTES.Logout },
    ];

    useEffect(() => {
        if (wallet.address) {
            getWalletBalance({ wallet: wallet.address });
        }
    }, [wallet]);

    useEffect(() => {
        const splitedLocation = location.split('/');
        if (splitedLocation[1] === 'wallet') {
            setActive(SIDE_BAR_ITEMS.find((item) => item.route === splitedLocation.at(-1))!.title);
        }
    }, [location]);

    return (
        <div className={styles.layout}>
            <Header />
            <div className={styles.layout_main}>
                <Sidebar />
                <div className={styles.layout_main_children}>
                    <h1>{active}</h1>
                    {children}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default DefaultLayout;
