import React, { useEffect } from 'react';
import { Burger, Copy, Logo } from 'assets/svg';
import { useAppSelector } from 'store';
import { useActions } from 'hooks/useActions';
import dotool from 'dotool';
import { useCopyToClipboard } from 'hooks/useCopyToClipboard';
import { toast } from 'react-toastify';
import styles from './header.module.scss';

const net_type = dotool.ss_network;
const version = dotool.system_version;

export const Header: React.FC = () => {
    const { wallet, isSidebarOpen } = useAppSelector((state) => state.wallet);
    const { toggleSidebar } = useActions();
    const { isCopied, copyToClipboard } = useCopyToClipboard();

    useEffect(() => {
        if (isCopied) {
            toast.success('Copied to clipboard');
        }
    }, [isCopied]);

    return (
        <div className={styles.header}>
            <div className={styles.header_desktop}>
                <div className={styles.header_desktop_sidebar}>
                    <Logo />
                </div>
                <div className={styles.header_desktop_container}>
                    <p>
                        {net_type} {version}
                    </p>
                    <div className={styles.header_desktop_container_account}>
                        <div>
                            <div>
                                <span>This node address:</span>
                                <p>{dotool.NODE_ADDRESS.toLowerCase()}</p>
                                <Copy onClick={() => copyToClipboard(dotool.NODE_ADDRESS)} />
                            </div>
                            <div>
                                <span>My address:</span>
                                <p>{wallet.address.toLowerCase()}</p>
                                <Copy onClick={() => copyToClipboard(wallet.address)} />
                            </div>
                        </div>
                        <div className={styles.header_desktop_container_account_circle}>
                            <div />
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles.header_mobile}>
                <div className={styles.header_mobile_logo}>
                    <div className={styles.header_mobile_logo_container}>
                        <Logo />
                    </div>
                </div>
                <div className={`${styles.header_mobile_container} ${isSidebarOpen ? styles.sidebarOpened : ''}`}>
                    <div className={styles.header_mobile_container_content}>
                        <Burger onClick={() => toggleSidebar()} />
                        <div className={styles.header_mobile_container_content_account}>
                            <div>
                                <div>
                                    <span>This node address:</span>
                                    <p>{dotool.NODE_ADDRESS.toLowerCase()}</p>
                                    <Copy onClick={() => copyToClipboard(dotool.NODE_ADDRESS)} />
                                </div>
                                <div>
                                    <span>My address:</span>
                                    <p>{wallet.address.toLowerCase()}</p>
                                    <Copy onClick={() => copyToClipboard(wallet.address)} />
                                </div>
                            </div>
                            <div className={styles.header_mobile_container_content_account_circle}>
                                <div />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
